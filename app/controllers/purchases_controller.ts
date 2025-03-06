import { CreatePurchase } from '#services/usecase/purchase/create_purchase'
import { DetailsPurchase } from '#services/usecase/purchase/details_purchase'
import { ListPurchases } from '#services/usecase/purchase/list_purchases'
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

  @inject()
  async allPurchases({ response }: HttpContext, listPurchases: ListPurchases) {
    const purchases = await listPurchases.execute()
    return response.status(200).json(purchases)
  }

  @inject()
  async purchaseDetails({ params, response }: HttpContext, detailsPurchase: DetailsPurchase) {
    const purchase = await detailsPurchase.execute(params.id)
    return response.status(200).json(purchase)
  }
}
