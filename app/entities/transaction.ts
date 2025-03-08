import Big from 'big.js'
import { ProductPurchasedDTO } from '../../contracts/product_dao.js'
import { DateTime } from 'luxon'

export default class Transaction {
  private id: string
  private clientId: string
  private clientName: string
  private clientEmail: string
  private gatewayId?: string
  private externalId?: string
  private status: TransactionStatus
  private amount: Big
  private cardNumbers: string
  private cardCvv: string
  private products: TransactionProduct[]
  private createdAt: DateTime
  private updatedAt: DateTime

  private constructor(
    id: string | undefined,
    clientId: string,
    clientName: string,
    clientEmail: string,
    amount: Big,
    products: TransactionProduct[],
    gatewayId: string | undefined,
    externalId: string | undefined,
    status: TransactionStatus,
    cardNumbers: string,
    cardCvv: string,
    createdAt: DateTime,
    updatedAt: DateTime
  ) {
    this.id = !id ? crypto.randomUUID() : id
    this.clientId = clientId
    this.clientName = clientName
    this.clientEmail = clientEmail
    this.amount = amount
    this.products = products
    this.gatewayId = gatewayId
    this.externalId = externalId
    this.status = status
    this.cardNumbers = cardNumbers
    this.cardCvv = cardCvv
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static create(
    clientId: string,
    clientName: string,
    clientEmail: string,
    products: ProductPurchasedDTO[],
    cardNumbers: string,
    cardCvv: string
  ): Transaction {
    const calculatedAmount = products.reduce(
      (acc, product) => acc.add(Big(product.amount).times(product.quantity)),
      new Big(0)
    )
    const transactionProducts = products.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
    }))
    return new Transaction(
      undefined,
      clientId,
      clientName,
      clientEmail,
      calculatedAmount,
      transactionProducts,
      undefined,
      undefined,
      TransactionStatus.CREATED,
      cardNumbers,
      cardCvv,
      DateTime.now(),
      DateTime.now()
    )
  }

  static restore(
    id: string,
    clientId: string,
    clientName: string,
    clientEmail: string,
    amount: Big,
    products: TransactionProduct[],
    gatewayId: string,
    externalId: string,
    status: TransactionStatus,
    cardNumbers: string,
    cardCvv: string,
    createdAt: DateTime,
    updatedAt: DateTime
  ): Transaction {
    return new Transaction(
      id,
      clientId,
      clientName,
      clientEmail,
      amount,
      products,
      gatewayId === '' ? undefined : gatewayId,
      externalId === '' ? undefined : externalId,
      status,
      cardNumbers,
      cardCvv,
      createdAt,
      updatedAt
    )
  }

  startProcessingPayment(): boolean {
    if (this.status === TransactionStatus.PENDING) return false
    if (this.status !== TransactionStatus.CREATED)
      throw new Error('Transaction must be in "CREATED" status to start processing payment')
    this.status = TransactionStatus.PENDING
    this.updatedAt = DateTime.now()
    return true
  }

  finishProcessingPayment(gatewayId: string, externalId: string): boolean {
    if (this.status === TransactionStatus.APPROVED) return false
    if (this.status !== TransactionStatus.PENDING)
      throw new Error('Transaction must be in "PENDING" status to finish processing payment')
    this.gatewayId = gatewayId
    this.externalId = externalId
    this.status = TransactionStatus.APPROVED
    this.updatedAt = DateTime.now()
    return true
  }

  reimbursePayment(): boolean {
    if (this.status === TransactionStatus.REFUNDED) return false
    if (this.status !== TransactionStatus.APPROVED)
      throw new Error('Transaction must be in "APPROVED" status to reimburse payment')
    this.status = TransactionStatus.REFUNDED
    this.updatedAt = DateTime.now()
    return true
  }

  isApproved(): boolean {
    return this.status === TransactionStatus.APPROVED
  }

  getId(): string {
    return this.id
  }
  getClientId(): string {
    return this.clientId
  }
  getClientName(): string {
    return this.clientName
  }
  getClientEmail(): string {
    return this.clientEmail
  }
  getGatewayId(): string | undefined {
    return this.gatewayId
  }
  getExternalId(): string | undefined {
    return this.externalId
  }
  getStatus(): TransactionStatus {
    return this.status
  }
  getAmount(): Big {
    return this.amount
  }
  getCardNumbers(): string {
    return this.cardNumbers
  }
  getCardLastNumbers(): string {
    return this.cardNumbers.slice(-4)
  }
  getCardCvv(): string {
    return this.cardCvv
  }
  getProducts(): TransactionProduct[] {
    return this.products.map((product) => ({ ...product }))
  }
  getCreatedAt(): DateTime {
    return this.createdAt
  }
  getUpdatedAt(): DateTime {
    return this.updatedAt
  }
}

export type TransactionProduct = {
  productId: string
  quantity: number
}

export enum TransactionStatus {
  CREATED = 'created',
  PENDING = 'pending',
  APPROVED = 'approved',
  REFUNDED = 'refunded',
}
