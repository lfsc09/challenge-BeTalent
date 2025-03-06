import Transaction, { TransactionStatus } from '../../entities/transaction.js'
import TransactionModel from '#models/transaction'
import ClientModel from '#models/client'
import TransactionProductModel from '#models/transaction_product'
import db from '@adonisjs/lucid/services/db'
import { PurchaseRepository } from '../../../contracts/purchase_repository.js'
import { errors as lucidErrors } from '@adonisjs/lucid'

export class PurchaseRepositoryDatabase implements PurchaseRepository {
  async restoreTransaction(id: string): Promise<Transaction> {
    const transaction = await TransactionModel.findOrFail(id)
    const client = await ClientModel.findOrFail(transaction.clientId)
    const products = await TransactionProductModel.findManyBy('transactionId', id)

    if (products.length === 0) throw new lucidErrors.E_ROW_NOT_FOUND(TransactionProductModel)

    return Transaction.restore(
      transaction.id,
      transaction.clientId,
      client.name,
      client.email,
      transaction.amount,
      products,
      transaction.gatewayId,
      transaction.externalId,
      transaction.status as TransactionStatus,
      transaction.cardNumbers,
      transaction.cardCvv,
      transaction.createdAt,
      transaction.updatedAt
    )
  }

  async persistTransaction(transaction: Transaction): Promise<void> {
    await db.transaction(
      async (trx) => {
        await TransactionModel.updateOrCreate(
          { id: transaction.getId() },
          {
            id: transaction.getId(),
            clientId: transaction.getClientId(),
            gatewayId: transaction.getGatewayId(),
            externalId: transaction.getExternalId(),
            status: transaction.getStatus(),
            amount: transaction.getAmount(),
            cardNumbers: transaction.getCardNumbers(),
            cardCvv: transaction.getCardCvv(),
            createdAt: transaction.getCreatedAt(),
            updatedAt: transaction.getUpdatedAt(),
          },
          { client: trx }
        )

        if (transaction.getStatus() === TransactionStatus.CREATED) {
          await TransactionProductModel.createMany(
            transaction.getProducts().map((product) => ({
              transactionId: transaction.getId(),
              productId: product.productId,
              quantity: product.quantity,
            })),
            { client: trx }
          )
        }
      },
      {
        isolationLevel: 'serializable',
      }
    )
  }
}
