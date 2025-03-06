import env from '#start/env'
import Big from 'big.js'
import { PaymentGateway } from '../../../contracts/payment_gateway.js'

export class PaymentGateway2 implements PaymentGateway {
  private authToken: AuthToken = {
    token: 'tk_f2198cc671b5289fa856',
    secret: '3d15e8ed6131446ea7e3456728b1211f',
  }
  private host?: string = env.get('GATEWAY2_HOST')
  private port?: string = env.get('GATEWAY2_PORT')
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
      const input: TransactionChargeData = {
        valor: Big(amount).mul(100).toNumber(),
        nome: clientName,
        email: clientEmail,
        numeroCartao: cardNumbers,
        cvv: cardCvv,
      }

      const response = await fetch(`http://${this.host}:${this.port}/transacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Gateway-Auth-Token': this.authToken.token,
          'Gateway-Auth-Secret': this.authToken.secret,
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

  async reimburse(id: string): Promise<void> {
    try {
      const input: TransactionReimburseData = {
        id,
      }

      const response = await fetch(`http://${this.host}:${this.port}/transacoes/reembolso`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Gateway-Auth-Token': this.authToken.token,
          'Gateway-Auth-Secret': this.authToken.secret,
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) throw new Error('Invalid ID provided')
    } catch (error) {
      throw new Error(`${this.constructor.name}: ${error.message}`)
    }
  }

  getId(): string {
    return this.id
  }
}

type AuthToken = {
  token: string
  secret: string
}

interface TransactionListData {
  id: string
  amount: number
  status: string
}

interface TransactionChargeData {
  valor: number
  nome: string
  email: string
  numeroCartao: string
  cvv: string
}

interface TransactionReimburseData {
  id: string
}
