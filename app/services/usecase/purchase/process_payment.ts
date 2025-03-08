import { inject } from '@adonisjs/core'
import Transaction from '../../../entities/transaction.js'
import { PurchaseRepository } from '../../../../contracts/purchase_repository.js'
import { PaymentFactory } from '../../../../contracts/payment_factory.js'
import { PaymentGateway } from '../../../../contracts/payment_gateway.js'
import emitter from '@adonisjs/core/services/emitter'
import { PurchaseCreatedEvent } from '../../../../types/events.js'

@inject()
export default class ProcessPayment {
  private paymentGateway: PaymentGateway | undefined
  private retryCount = 0
  private maxRetries = 3
  private timeout = 2000

  constructor(
    private purchaseRepository: PurchaseRepository,
    private paymentFactory: PaymentFactory
  ) {}

  async eventExecute(input: PurchaseCreatedEvent) {
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
            emitter.emit('payment:failed', {
              transactionId: input.transactionId,
              retryCount: this.retryCount,
            })
          }, this.timeout * this.retryCount)
        } else {
          console.warn('Max retries reached. Marking gateway as down.')
          // Enable circuit breaker on gateway
          if (this.paymentGateway)
            await this.paymentFactory.markGatewayAsDown(this.paymentGateway.getId())
          setTimeout(() => {
            emitter.emit('payment:failed', { transactionId: input.transactionId, retryCount: 0 })
          }, this.timeout * this.retryCount)
        }
      }
    }
  }

  async execute(input: string) {
    console.log(
      this.retryCount === 0
        ? 'Processing payment...'
        : `Retrying... (${this.retryCount}/${this.maxRetries})`
    )
    // Restore the transaction
    const transaction: Transaction = await this.purchaseRepository.restoreTransaction(input)
    console.log('Transaction restored: ', transaction.getId())
    console.log('Transaction status:', transaction.getStatus())
    if (transaction.startProcessingPayment()) {
      await this.purchaseRepository.persistTransaction(transaction)
      console.log('Transaction status:', transaction.getStatus())
    }

    // Connect to gateway to process payment
    this.paymentGateway = await this.paymentFactory.fetchPaymentGateway()
    let paymentId = await this.paymentGateway.charge(
      transaction.getAmount(),
      transaction.getClientName(),
      transaction.getClientEmail(),
      transaction.getCardNumbers(),
      transaction.getCardCvv()
    )
    console.log(`Payment done through [${this.paymentGateway.constructor.name}] ID:`, paymentId)

    // If payment is successful, finish the transaction
    if (paymentId && transaction.finishProcessingPayment(this.paymentGateway.getId(), paymentId)) {
      await this.purchaseRepository.persistTransaction(transaction)
      console.log('Transaction status:', transaction.getStatus())
    }
  }
}
