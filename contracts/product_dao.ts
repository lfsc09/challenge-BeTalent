import { DateTime } from 'luxon'

export abstract class ProductDAO {
  abstract getAllProducts(): Promise<ProductDTO[]>
  abstract createProduct(input: CreateProductDTO): Promise<void>
  abstract updateProduct(id: string, input: UpdateProductDTO): Promise<void>
  abstract deleteProduct(id: string): Promise<void>
}

export type ProductDTO = {
  id: string
  name: string
  amount: number
  createdAt: DateTime
  updatedAt: DateTime
}

export type CreateProductDTO = {
  name: string
  amount: Big
}

export type UpdateProductDTO = {
  name?: string
  amount?: Big
}
