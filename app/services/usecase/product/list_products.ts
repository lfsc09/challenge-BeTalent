import { inject } from '@adonisjs/core'
import { ProductDAO, ProductDTO } from '../../../../contracts/product_dao.js'

@inject()
export class ListProducts {
  constructor(private productDAO: ProductDAO) {}

  async execute(): Promise<ProductDTO[]> {
    return await this.productDAO.getAllProducts()
  }
}
