import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'crypto'

export default class Gateway extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(gateway: Gateway) {
    gateway.id = randomUUID()
  }

  @column()
  declare name: string

  @column()
  declare isActive: boolean

  @column()
  declare priority: number

  @column()
  declare gatewayModule: string

  @column.dateTime()
  declare downSince: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
