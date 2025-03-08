import { inject } from '@adonisjs/core'
import { CreateProductDTO, ProductDAO } from '../../../../contracts/product_dao.js'

@inject()
export class CreateProduct {
  constructor(private productDAO: ProductDAO) {}

  async execute(input: CreateProductDTO): Promise<void> {
    await this.productDAO.createProduct(input)
  }
}
