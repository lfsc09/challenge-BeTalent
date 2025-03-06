import { CreatePurchase } from '#services/usecase/purchase/create_purchase'
import { createPurchaseValidator } from '#validators/purchase'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class PurchasesController {
  @inject()
  async newPurchase({ request, response }: HttpContext, createPurchase: CreatePurchase) {
    const input = await request.validateUsing(createPurchaseValidator)
    await createPurchase.execute(input)
    return response.status(201)
  }
}
