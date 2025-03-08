import { DateTime } from 'luxon'

export abstract class PurchaseDAO {
  abstract getAllPurchases(): Promise<PurchaseDTO[]>
  abstract getPurchaseDetails(id: string): Promise<DetailsPurchaseDTO>
  abstract checkExistence(id: string): Promise<string>
}

export type PurchaseDTO = {
  id: string
  status: string
  amount: string
  createdAt: DateTime
  updatedAt: DateTime
}

export type DetailsPurchaseDTO = {
  id: string
  clientName: string
  clientEmail: string
  gatewayName: string
  externalId: string
  status: string
  amount: string
  products: {
    name: string
    quantity: number
  }[]
  createdAt: DateTime
  updatedAt: DateTime
}
