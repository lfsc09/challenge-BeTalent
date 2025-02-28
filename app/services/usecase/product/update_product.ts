import { inject } from '@adonisjs/core'
import { UpdateProductDTO, ProductDAO } from '../../../../contracts/product_dao.js'

@inject()
export class UpdateProduct {
  constructor(private productDAO: ProductDAO) {}

  async execute(id: string, input: UpdateProductDTO): Promise<void> {
    await this.productDAO.updateProduct(id, input)
  }
}
