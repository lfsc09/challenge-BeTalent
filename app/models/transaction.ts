import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import Big from 'big.js'
import encryption from '@adonisjs/core/services/encryption'

export default class Transaction extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare clientId: string

  @column()
  declare gatewayId: string

  @column()
  declare externalId: string

  @column()
  declare status: string

  @column({
    consume: (value: string) => new Big(value),
    prepare: (value: Big) => value.toString(),
  })
  declare amount: Big

  @column({
    serializeAs: null,
    prepare: (value: string) => encryption.encrypt(value),
    consume: (value: string) => encryption.decrypt(value),
  })
  declare cardNumbers: string

  @column({
    serializeAs: null,
    prepare: (value: string) => encryption.encrypt(value),
    consume: (value: string) => encryption.decrypt(value),
  })
  declare cardCvv: string

  @column.dateTime()
  declare createdAt: DateTime

  @column.dateTime()
  declare updatedAt: DateTime
}
