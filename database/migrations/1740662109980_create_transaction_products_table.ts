import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .string('transaction_id')
        .notNullable()
        .references('id')
        .inTable('transactions')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .string('product_id')
        .references('id')
        .inTable('products')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.integer('quantity').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
