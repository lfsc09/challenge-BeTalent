import { inject } from '@adonisjs/core'
import { PurchaseDAO, PurchaseDTO } from '../../../../contracts/purchase_dao.js'

@inject()
export class ListPurchases {
  constructor(private purchaseDAO: PurchaseDAO) {}

  async execute(): Promise<PurchaseDTO[]> {
    return await this.purchaseDAO.getAllPurchases()
  }
}
