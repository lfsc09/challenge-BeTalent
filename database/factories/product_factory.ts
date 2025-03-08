import factory from '@adonisjs/lucid/factories'
import Product from '#models/product'
import Big from 'big.js'

export const ProductFactory = factory
  .define(Product, async ({ faker }) => {
    return {
      name: faker.commerce.productName(),
      amount: new Big(faker.number.float({ min: 1.0, max: 100.0, fractionDigits: 2 })),
    }
  })
  .build()
