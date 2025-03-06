import { inject } from '@adonisjs/core'
import { GatewayDAO, UsableGatewayDTO } from '../../../contracts/gateway_dao.js'
import { PaymentGateway } from '../../../contracts/payment_gateway.js'
import env from '#start/env'

@inject()
export class PaymentFactoryImpl {
  private autoRecover: boolean = env.get('AUTO_RECOVER_GATEWAY', true)
  // In minutes
  private downTimeMax: number = env.get('AUTO_RECOVER_GATEWAY_IN_MINUTES', 2)

  constructor(private gatewayDAO: GatewayDAO) {}

  async fetchPaymentGateway(): Promise<PaymentGateway> {
    // Fetch all the gateways, including down ones
    const gateways = await this.gatewayDAO.getGatewaysToUse()
    const availableGateways: UsableGatewayDTO[] = []

    for (const gateway of gateways) {
      if (gateway?.isActive) availableGateways.push(gateway)
      // Recover gateways that have been down for more than `downTimeMax` minutes
      else if (
        this.autoRecover &&
        gateway?.downSince &&
        Math.abs(gateway.downSince.diffNow('minutes').minutes) >= this.downTimeMax
      ) {
        await this.gatewayDAO.markGatewayAsUp(gateway.id)
        availableGateways.push(gateway)
      }
    }

    if (availableGateways.length === 0) throw new Error('No available gateways')

    switch (availableGateways.at(0)!.gatewayModule) {
      case 'gateway1':
        const { PaymentGateway1 } = await import('#services/gateway/payment_gateway1')
        return new PaymentGateway1(availableGateways.at(0)!.id)
      case 'gateway2':
        const { PaymentGateway2 } = await import('#services/gateway/payment_gateway2')
        return new PaymentGateway2(availableGateways.at(0)!.id)
      default:
        throw new Error('Invalid gateway')
    }
  }

  async markGatewayAsDown(gatewayId: string): Promise<void> {
    await this.gatewayDAO.markGatewayAsDown(gatewayId)
  }
}
