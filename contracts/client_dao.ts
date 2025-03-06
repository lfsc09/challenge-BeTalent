import { DateTime } from 'luxon'

export abstract class ClientDAO {
  abstract getAllClients(): Promise<ClientDTO[]>
  abstract getClientDetails(id: string): Promise<ClientDetailsDTO>
  abstract findOrCreateClient(input: CreateClientDTO): Promise<CreatedClientDTO>
}

export type ClientDTO = {
  id: string
  name: string
  email: string
  createdAt: DateTime
  updatedAt: DateTime
}

export type ClientDetailsDTO = {
  id: string
  name: string
  email: string
  purchases: any[]
}

export type CreateClientDTO = {
  name: string
  email: string
}
export type CreatedClientDTO = {
  id: string
  name: string
  email: string
}
