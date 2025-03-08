import { DateTime } from 'luxon'

export abstract class GatewayDAO {
  abstract getGatewayUsed(gatewayId: string): Promise<UsableGatewayDTO | null>
  abstract getGatewaysToUse(): Promise<UsableGatewayDTO[]>
  abstract markGatewayAsDown(gatewayId: string): Promise<void>
  abstract markGatewayAsUp(gatewayId: string): Promise<void>
  abstract updateGateway(id: string, input: UpdateGatewayDTO): Promise<void>
}

export type UsableGatewayDTO = {
  id: string
  isActive: boolean
  gatewayModule: string
  downSince: DateTime | null
}

export type UpdateGatewayDTO = {
  isActive?: boolean
  priority?: number
}
