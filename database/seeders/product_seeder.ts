import Product from '#models/product'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Big from 'big.js'

export default class extends BaseSeeder {
  async run() {
    const uniqueKey = 'name'

    await Product.updateOrCreateMany(uniqueKey, [
      {
        name: 'produto 1',
        amount: new Big(10.5),
      },
      {
        name: 'produto 2',
        amount: new Big(5),
      },
      {
        name: 'produto 3',
        amount: new Big(64.21),
      },
    ])
  }
}
