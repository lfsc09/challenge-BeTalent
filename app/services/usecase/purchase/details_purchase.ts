import { inject } from '@adonisjs/core'
import { DetailsPurchaseDTO, PurchaseDAO } from '../../../../contracts/purchase_dao.js'

@inject()
export class DetailsPurchase {
  constructor(private purchaseDAO: PurchaseDAO) {}

  async execute(id: string): Promise<DetailsPurchaseDTO> {
    return await this.purchaseDAO.getPurchaseDetails(id)
  }
}
