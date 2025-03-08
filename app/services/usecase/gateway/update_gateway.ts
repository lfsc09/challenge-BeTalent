import { inject } from '@adonisjs/core'
import { UpdateGatewayDTO, GatewayDAO } from '../../../../contracts/gateway_dao.js'

@inject()
export class UpdateGateway {
  constructor(private gatewayDAO: GatewayDAO) {}

  async execute(id: string, input: UpdateGatewayDTO): Promise<void> {
    await this.gatewayDAO.updateGateway(id, input)
  }
}
