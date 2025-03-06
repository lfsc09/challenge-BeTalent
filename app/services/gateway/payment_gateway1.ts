import env from '#start/env'
import Big from 'big.js'
import { PaymentGateway } from '../../../contracts/payment_gateway.js'

export class PaymentGateway1 implements PaymentGateway {
  private authToken?: AuthToken
  private host?: string = env.get('GATEWAY1_HOST')
  private port?: string = env.get('GATEWAY1_PORT')
  private id: string

  constructor(id: string) {
    this.id = id
  }

  async list(): Promise<TransactionListData[]> {
    throw new Error('Method not implemented.')
  }

  async charge(
    amount: Big,
    clientName: string,
    clientEmail: string,
    cardNumbers: string,
    cardCvv: string
  ): Promise<string> {
    try {
      if (!this.authToken) await this.authenticate()

      const input: TransactionChargeData = {
        amount: Big(amount).mul(100).toNumber(),
        name: clientName,
        email: clientEmail,
        cardNumber: cardNumbers,
        cvv: cardCvv,
      }

      const response = await fetch(`http://${this.host}:${this.port}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${this.authToken}`,
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) throw new Error('Invalid card information')

      const responseData = (await response.json()) as { id: string }
      return responseData?.id ?? null
    } catch (error) {
      throw new Error(`${this.constructor.name}: ${error.message}`)
    }
  }

  async reimburse(): Promise<string> {
    throw new Error('Method not implemented.')
  }

  getId(): string {
    return this.id
  }

  private async authenticate(): Promise<void> {
    const response = await fetch(`http://${this.host}:${this.port}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'dev@betalent.tecsh',
        token: 'FEC9BB078BF338F464F96B48089EB498',
      }),
    })

    if (!response.ok) throw new Error('Failed to authenticate')

    const responseData = (await response.json()) as { token: string }
    this.authToken = responseData?.token
  }
}

type AuthToken = string

interface TransactionListData {
  id: string
  amount: number
  status: string
}

interface TransactionChargeData {
  amount: number
  name: string
  email: string
  cardNumber: string
  cvv: string
}
