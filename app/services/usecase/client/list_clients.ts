import { inject } from '@adonisjs/core'
import { ClientDAO, ClientDTO } from '../../../../contracts/client_dao.js'

@inject()
export class ListClients {
  constructor(private purchaseDAO: ClientDAO) {}

  async execute(): Promise<ClientDTO[]> {
    return await this.purchaseDAO.getAllClients()
  }
}
