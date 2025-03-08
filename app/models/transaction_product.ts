import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TransactionProduct extends BaseModel {
  @column()
  declare transactionId: string

  @column()
  declare productId: string

  @column()
  declare quantity: number
}
