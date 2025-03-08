import ClientModel from '#models/client'
import {
  CreateClientDTO,
  ClientDAO,
  ClientDTO,
  ClientDetailsDTO,
  CreatedClientDTO,
} from '../../../contracts/client_dao.js'
import db from '@adonisjs/lucid/services/db'

export class ClientDAODatabase implements ClientDAO {
  async getAllClients(): Promise<ClientDTO[]> {
    return (await ClientModel.all()).map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))
  }

  async getClientDetails(id: string): Promise<ClientDetailsDTO> {
    const client = await ClientModel.findOrFail(id)
    const purchases = await db
      .from('transactions')
      .where('client_id', id)
      .select('id', 'status', 'amount', 'created_at', 'updated_at')

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      purchases: purchases.map((purchase) => ({
        id: purchase.id,
        status: purchase.status,
        amount: purchase.amount.toString(),
        createdAt: purchase.created_at,
        updatedAt: purchase.updated_at,
      })),
    }
  }

  async findOrCreateClient(input: CreateClientDTO): Promise<CreatedClientDTO> {
    return await ClientModel.firstOrCreate({ email: input.email }, input)
  }
}
