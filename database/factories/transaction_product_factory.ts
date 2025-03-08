import factory from '@adonisjs/lucid/factories'
import TransactionProduct from '#models/transaction_product'

export const TransactionProductFactory = factory
  .define(TransactionProduct, async ({ faker }) => {
    return {
      transactionId: faker.string.uuid(),
      productId: faker.string.uuid(),
      quantity: faker.number.int({ min: 1, max: 10 }),
    }
  })
  .build()
