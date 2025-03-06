import { inject } from '@adonisjs/core'
import { ClientDetailsDTO, ClientDAO } from '../../../../contracts/client_dao.js'

@inject()
export class DetailsClient {
  constructor(private purchaseDAO: ClientDAO) {}

  async execute(id: string): Promise<ClientDetailsDTO> {
    return await this.purchaseDAO.getClientDetails(id)
  }
}
