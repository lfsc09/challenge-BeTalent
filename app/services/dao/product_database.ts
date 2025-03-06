import ProductModel from '#models/product'
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductDAO,
  ProductDTO,
  ProductToBePurchasedDTO,
  ProductPurchasedDTO,
} from '../../../contracts/product_dao.js'
import { errors as lucidErrors } from '@adonisjs/lucid'

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

  async getProductsByIds(input: ProductToBePurchasedDTO[]): Promise<ProductPurchasedDTO[]> {
    const products = await ProductModel.query().whereIn(
      'id',
      input.map((product) => product.productId)
    )

    if (products.length !== input.length) throw new lucidErrors.E_ROW_NOT_FOUND(ProductModel)

    return products.map((product) => ({
      id: product.id,
      quantity: input.find((inputProduct) => inputProduct.productId === product.id)!.quantity,
      amount: product.amount,
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
