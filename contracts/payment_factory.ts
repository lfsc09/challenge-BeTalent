import { PaymentGateway } from './payment_gateway.js'

export abstract class PaymentFactory {
  abstract fetchPaymentGateway(): Promise<PaymentGateway>
  abstract markGatewayAsDown(gatewayId: string): Promise<void>
}
