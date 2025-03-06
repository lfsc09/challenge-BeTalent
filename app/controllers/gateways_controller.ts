import { UpdateGateway } from '#services/usecase/gateway/update_gateway'
import { updateActiveGatewayValidator, updatePriorityGatewayValidator } from '#validators/gateway'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class GatewaysController {
  @inject()
  async editActive({ request, response, params }: HttpContext, updateGateway: UpdateGateway) {
    const input = await request.validateUsing(updateActiveGatewayValidator)
    await updateGateway.execute(params.id, input)
    return response.status(200)
  }

  @inject()
  async editPriority({ request, response, params }: HttpContext, updateGateway: UpdateGateway) {
    const input = await request.validateUsing(updatePriorityGatewayValidator)
    await updateGateway.execute(params.id, input)
    return response.status(200)
  }
}
