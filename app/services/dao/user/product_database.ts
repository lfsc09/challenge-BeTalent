import ProductModel from '#models/product'
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductDAO,
  ProductDTO,
} from '../../../../contracts/product_dao.js'

export class ProductDAODatabase implements ProductDAO {
  async getAllProducts(): Promise<ProductDTO[]> {
    return (await ProductModel.all()).map((product) => ({
      id: product.id,
      name: product.name,
      amount: product.amount.toNumber(),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))
  }

  async createProduct(input: CreateProductDTO): Promise<void> {
    await ProductModel.create(input)
  }

  async updateProduct(id: string, input: UpdateProductDTO): Promise<void> {
    const product = await ProductModel.findOrFail(id)
    product.merge(input)
    await product.save()
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await ProductModel.findOrFail(id)
    await product.delete()
  }
}
