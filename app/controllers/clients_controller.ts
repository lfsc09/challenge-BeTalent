import { DetailsClient } from '#services/usecase/client/details_client'
import { ListClients } from '#services/usecase/client/list_clients'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  @inject()
  async allClients({ response }: HttpContext, listClients: ListClients) {
    const clients = await listClients.execute()
    return response.status(200).json(clients)
  }

  @inject()
  async clientDetails({ params, response }: HttpContext, detailsClient: DetailsClient) {
    const client = await detailsClient.execute(params.id)
    return response.status(200).json(client)
  }
}
