import { inject } from '@adonisjs/core'
import { ProductDAO } from '../../../../contracts/product_dao.js'

@inject()
export class DeleteProduct {
  constructor(private productDAO: ProductDAO) {}

  async execute(id: string): Promise<void> {
    await this.productDAO.deleteProduct(id)
  }
}
