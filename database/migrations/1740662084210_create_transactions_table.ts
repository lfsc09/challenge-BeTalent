import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table
        .string('client_id')
        .references('id')
        .inTable('clients')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .string('gateway_id')
        .references('id')
        .inTable('gateways')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.string('external_id')
      table.string('status').notNullable().checkIn(['created', 'pending', 'approved', 'refunded'])
      table.decimal('amount', 20, 2).notNullable()
      table.string('card_numbers').notNullable()
      table.string('card_cvv').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
