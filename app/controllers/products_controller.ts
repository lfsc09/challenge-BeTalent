import Product from '#models/product'
import { createProductValidator, updateProductValidator } from '#validators/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async allProducts({ response }: HttpContext) {
    const products = await Product.all()
    return response.status(200).json(products)
  }

  async newProduct({ request, response }: HttpContext) {
    const input = await request.validateUsing(createProductValidator)
    const output = await Product.create(input)
    return response.status(output.$isPersisted ? 201 : 400)
  }

  async editProduct({ request, response, params }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const input = await request.validateUsing(updateProductValidator)
    product.merge(input)
    const output = await product.save()
    return response.status(output.$isPersisted ? 200 : 400)
  }

  async deleteProduct({ response, params }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.status(200)
  }
}
