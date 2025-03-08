import { inject } from '@adonisjs/core'
import { ClientDAO } from '../../../../contracts/client_dao.js'
import { ProductDAO } from '../../../../contracts/product_dao.js'
import Transaction from '../../../entities/transaction.js'
import emitter from '@adonisjs/core/services/emitter'
import { PurchaseRepository } from '../../../../contracts/purchase_repository.js'

@inject()
export class CreatePurchase {
  constructor(
    private purchaseRepository: PurchaseRepository,
    private clientDAO: ClientDAO,
    private productDAO: ProductDAO
  ) {}

  async execute(input: CreatePurchaseDTO): Promise<void> {
    // Create/fetch client
    const client = await this.clientDAO.findOrCreateClient({
      name: input.clientName,
      email: input.clientEmail,
    })

    // Fetch/validate products with added info
    const products = await this.productDAO.getProductsByIds(input.products)

    // Create initial transaction
    const transaction = Transaction.create(
      client.id,
      client.name,
      client.email,
      products,
      input.cardNumbers,
      input.cardCvv
    )

    // Persist transaction
    await this.purchaseRepository.persistTransaction(transaction)

    // Emitt event to proccess payment
    emitter.emit('purchase:created', { transactionId: transaction.getId(), retryCount: 0 })
  }
}

export type CreatePurchaseDTO = {
  clientName: string
  clientEmail: string
  products: {
    productId: string
    quantity: number
  }[]
  cardNumbers: string
  cardCvv: string
}
