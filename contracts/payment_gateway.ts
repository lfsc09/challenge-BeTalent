import Big from 'big.js'

export abstract class PaymentGateway {
  abstract list(): Promise<unknown[]>
  abstract charge(
    amount: Big,
    clientName: string,
    clientEmail: string,
    cardNumbers: string,
    cardCvv: string
  ): Promise<string>
  abstract reimburse(): Promise<string>
  abstract getId(): string
}
