import ClientModel from '#models/client'
import {
  CreateClientDTO,
  ClientDAO,
  ClientDTO,
  ClientDetailsDTO,
  CreatedClientDTO,
} from '../../../contracts/client_dao.js'

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
    throw new Error('Method not implemented.')
  }

  async findOrCreateClient(input: CreateClientDTO): Promise<CreatedClientDTO> {
    return await ClientModel.firstOrCreate({ email: input.email }, input)
  }
}
