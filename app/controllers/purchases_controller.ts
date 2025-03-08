import { userRole } from '#abilities/main'
import { CreatePurchase } from '#services/usecase/purchase/create_purchase'
import { DetailsPurchase } from '#services/usecase/purchase/details_purchase'
import { ListPurchases } from '#services/usecase/purchase/list_purchases'
import { ReimbursePurchase } from '#services/usecase/purchase/reimburse_purchase'
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
  async allPurchases({ response, bouncer }: HttpContext, listPurchases: ListPurchases) {
    if (await bouncer.denies(userRole, ['USER', 'ADMIN'])) return response.forbidden()
    const purchases = await listPurchases.execute()
    return response.status(200).json(purchases)
  }

  @inject()
  async purchaseDetails(
    { params, response, bouncer }: HttpContext,
    detailsPurchase: DetailsPurchase
  ) {
    if (await bouncer.denies(userRole, ['USER', 'ADMIN'])) return response.forbidden()
    const purchase = await detailsPurchase.execute(params.id)
    return response.status(200).json(purchase)
  }

  @inject()
  async reimburse(
    { params, response, bouncer }: HttpContext,
    reimbursePurchase: ReimbursePurchase
  ) {
    if (await bouncer.denies(userRole, ['FINANCE', 'ADMIN'])) return response.forbidden()
    await reimbursePurchase.execute(params.id)
    return response.status(200)
  }
}
