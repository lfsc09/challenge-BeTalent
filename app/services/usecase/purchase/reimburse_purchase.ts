import { inject } from '@adonisjs/core'
import { PurchaseDAO } from '../../../../contracts/purchase_dao.js'
import emitter from '@adonisjs/core/services/emitter'

@inject()
export class ReimbursePurchase {
  constructor(private purchaseDAO: PurchaseDAO) {}

  async execute(id: string): Promise<void> {
    const transactionId = await this.purchaseDAO.checkExistence(id)

    // Emitt event to proccess payment
    emitter.emit('purchase:reimburse', { transactionId, retryCount: 0 })
  }
}
