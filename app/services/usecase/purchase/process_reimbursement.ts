import { inject } from '@adonisjs/core'
import Transaction from '../../../entities/transaction.js'
import { PurchaseRepository } from '../../../../contracts/purchase_repository.js'
import { PaymentFactory } from '../../../../contracts/payment_factory.js'
import { PaymentGateway } from '../../../../contracts/payment_gateway.js'
import emitter from '@adonisjs/core/services/emitter'
import { PurchaseReimburseEvent } from '../../../../types/events.js'

@inject()
export default class ProcessReimbursement {
  private paymentGateway: PaymentGateway | undefined
  private retryCount = 0
  private maxRetries = 3
  private timeout = 2000

  constructor(
    private purchaseRepository: PurchaseRepository,
    private paymentFactory: PaymentFactory
  ) {}

  async eventExecute(input: PurchaseReimburseEvent) {
    try {
      this.retryCount = input.retryCount
      await this.execute(input.transactionId)
    } catch (error) {
      console.warn(error.message)
      // For Gateway connection errors, retry (linear backoff)
      if (/fetch failed/i.test(error.message)) {
        if (this.retryCount < this.maxRetries) {
          this.retryCount++
          setTimeout(() => {
            emitter.emit('reimbursement:failed', {
              transactionId: input.transactionId,
              retryCount: this.retryCount,
            })
          }, this.timeout * this.retryCount)
        } else {
          console.warn('Max retries reached. Marking gateway as down.')
          // Enable circuit breaker on gateway
          if (this.paymentGateway)
            await this.paymentFactory.markGatewayAsDown(this.paymentGateway.getId())
        }
      }
    }
  }

  async execute(input: string) {
    console.log(
      this.retryCount === 0
        ? 'Processing reimbursement...'
        : `Retrying... (${this.retryCount}/${this.maxRetries})`
    )
    // Restore the transaction
    const transaction: Transaction = await this.purchaseRepository.restoreTransaction(input)
    console.log('Transaction restored: ', transaction.getId())

    if (!transaction.isApproved()) throw new Error('Invalid transaction state for reimbursement')

    console.log('Transaction status:', transaction.getStatus())

    // Connect to gateway to process reimbursement
    this.paymentGateway = await this.paymentFactory.fetchReimbursementGateway(
      transaction.getGatewayId()!
    )
    await this.paymentGateway.reimburse(transaction.getExternalId()!)
    console.log(`Payment reimbursed through [${this.paymentGateway.constructor.name}]`)

    // If reimbursement is successful, update the transaction
    if (transaction.reimbursePayment()) {
      await this.purchaseRepository.persistTransaction(transaction)
      console.log('Transaction status:', transaction.getStatus())
    }
  }
}
