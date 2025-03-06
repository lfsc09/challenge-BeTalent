import { DateTime } from 'luxon'

export abstract class GatewayDAO {
  abstract getGatewaysToUse(): Promise<UsableGatewayDTO[]>
  abstract markGatewayAsDown(gatewayId: string): Promise<void>
  abstract markGatewayAsUp(gatewayId: string): Promise<void>
}

export type UsableGatewayDTO = {
  id: string
  isActive: boolean
  gatewayModule: string
  downSince: DateTime | null
} | null
