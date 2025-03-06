import GatewayModel from '#models/gateway'
import { DateTime } from 'luxon'
import { UsableGatewayDTO, UpdateGatewayDTO, GatewayDAO } from '../../../contracts/gateway_dao.js'

export class GatewayDAODatabase implements GatewayDAO {
  async getGatewayUsed(gatewayId: string): Promise<UsableGatewayDTO | null> {
    return await GatewayModel.query()
      .where('id', gatewayId)
      .select('id', 'isActive', 'gatewayModule', 'downSince')
      .first()
  }

  async getGatewaysToUse(): Promise<UsableGatewayDTO[]> {
    return await GatewayModel.query()
      .select('id', 'isActive', 'gatewayModule', 'downSince')
      .orderBy('priority', 'desc')
  }

  async markGatewayAsDown(gatewayId: string): Promise<void> {
    const gateway = await GatewayModel.find(gatewayId)
    gateway?.merge({ isActive: false, downSince: DateTime.now() })
    await gateway?.save()
  }

  async markGatewayAsUp(gatewayId: string): Promise<void> {
    const gateway = await GatewayModel.find(gatewayId)
    gateway?.merge({ isActive: true, downSince: null })
    await gateway?.save()
  }

  async updateGateway(id: string, input: UpdateGatewayDTO): Promise<void> {
    const gateway = await GatewayModel.findOrFail(id)
    gateway.merge(input)
    await gateway?.save()
  }
}
