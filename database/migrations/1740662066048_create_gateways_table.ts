import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gateways'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('name').notNullable().unique()
      table.boolean('is_active').notNullable().defaultTo(false)
      table.integer('priority').notNullable().defaultTo(0)
      table.string('gateway_module').notNullable()
      table.timestamp('down_since')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
