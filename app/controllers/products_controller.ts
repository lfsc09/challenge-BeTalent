import { userRole } from '#abilities/main'
import { CreateProduct } from '#services/usecase/product/create_product'
import { DeleteProduct } from '#services/usecase/product/delete_product'
import { ListProducts } from '#services/usecase/product/list_products'
import { UpdateProduct } from '#services/usecase/product/update_product'
import { createProductValidator, updateProductValidator } from '#validators/product'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  @inject()
  async allProducts({ response, bouncer }: HttpContext, listProducts: ListProducts) {
    if (await bouncer.denies(userRole, ['FINANCE', 'MANAGER', 'ADMIN'])) return response.forbidden()
    const users = await listProducts.execute()
    return response.status(200).json(users)
  }

  @inject()
  async newProduct({ request, response, bouncer }: HttpContext, createProduct: CreateProduct) {
    if (await bouncer.denies(userRole, ['FINANCE', 'MANAGER', 'ADMIN'])) return response.forbidden()
    const input = await request.validateUsing(createProductValidator)
    await createProduct.execute(input)
    return response.status(201)
  }

  @inject()
  async editProduct(
    { request, response, params, bouncer }: HttpContext,
    updateProduct: UpdateProduct
  ) {
    if (await bouncer.denies(userRole, ['FINANCE', 'MANAGER', 'ADMIN'])) return response.forbidden()
    const input = await request.validateUsing(updateProductValidator)
    await updateProduct.execute(params.id, input)
    return response.status(200)
  }

  @inject()
  async deleteProduct({ response, params, bouncer }: HttpContext, deleteProduct: DeleteProduct) {
    if (await bouncer.denies(userRole, ['FINANCE', 'MANAGER', 'ADMIN'])) return response.forbidden()
    await deleteProduct.execute(params.id)
    return response.status(200)
  }
}
