import { inject } from '@adonisjs/core'
import { GatewayDAO, UsableGatewayDTO } from '../../../contracts/gateway_dao.js'
import { PaymentGateway } from '../../../contracts/payment_gateway.js'
import { PaymentFactory } from '../../../contracts/payment_factory.js'
import env from '#start/env'

@inject()
export class PaymentFactoryImpl implements PaymentFactory {
  private autoRecover: boolean = env.get('AUTO_RECOVER_GATEWAY', true)
  // In minutes
  private downTimeMax: number = env.get('AUTO_RECOVER_GATEWAY_IN_MINUTES', 2)

  constructor(private gatewayDAO: GatewayDAO) {}

  async fetchPaymentGateway(): Promise<PaymentGateway> {
    // Fetch all the gateways, including down ones
    const gateways = await this.gatewayDAO.getGatewaysToUse()
    const availableGateways: UsableGatewayDTO[] = []

    for (const gateway of gateways) {
      if (gateway.isActive) availableGateways.push(gateway)
      // Recover gateways that have been down for more than `downTimeMax` minutes
      else if (
        this.autoRecover &&
        gateway.downSince &&
        Math.abs(gateway.downSince.diffNow('minutes').minutes) >= this.downTimeMax
      ) {
        await this.gatewayDAO.markGatewayAsUp(gateway.id)
        availableGateways.push(gateway)
      }
    }

    if (availableGateways.length === 0) throw new Error('No available gateways')

    return this.getInstance(availableGateways.at(0)!)
  }

  async fetchReimbursementGateway(gatewayId: string): Promise<PaymentGateway> {
    const gateway = await this.gatewayDAO.getGatewayUsed(gatewayId)

    if (!gateway) throw new Error('Used gateway not found')

    if (gateway.isActive) return this.getInstance(gateway)
    else if (
      this.autoRecover &&
      gateway.downSince &&
      Math.abs(gateway.downSince.diffNow('minutes').minutes) >= this.downTimeMax
    ) {
      await this.gatewayDAO.markGatewayAsUp(gateway.id)
      return this.getInstance(gateway)
    } else throw new Error('Used gateway is down')
  }

  async markGatewayAsDown(gatewayId: string): Promise<void> {
    await this.gatewayDAO.markGatewayAsDown(gatewayId)
  }

  private async getInstance(gateway: UsableGatewayDTO): Promise<PaymentGateway> {
    switch (gateway.gatewayModule) {
      case 'gateway1':
        const { PaymentGateway1 } = await import('#services/gateway/payment_gateway1')
        return new PaymentGateway1(gateway.id)
      case 'gateway2':
        const { PaymentGateway2 } = await import('#services/gateway/payment_gateway2')
        return new PaymentGateway2(gateway.id)
      default:
        throw new Error('Invalid gateway')
    }
  }
}
