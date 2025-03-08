import Product from '#models/product'
import { test } from '@japa/runner'
import { Faker, pt_BR, en } from '@faker-js/faker'
import Client from '#models/client'
import Transaction from '#models/transaction'
import emitter from '@adonisjs/core/services/emitter'
import TransactionProduct from '#models/transaction_product'
import { ProductFactory } from '#database/factories/product_factory'

test.group('Purchase new', (group) => {
  const faker = new Faker({ locale: [pt_BR, en] })
  let productIds: string[] = []

  group.each.setup(async () => {
    await Client.query().delete()
    await Product.query().delete()
    await Transaction.query().delete()
    await TransactionProduct.query().delete()
    productIds = (await ProductFactory.createMany(2)).map((product) => product.id)
  })

  test('should sucessfully generate purchase', async ({ client, expect, cleanup }) => {
    const input = {
      clientName: faker.person.fullName(),
      clientEmail: faker.internet.email(),
      products: productIds.map((id) => ({
        productId: id,
        quantity: faker.number.int({ min: 1, max: 10 }),
      })),
      cardNumbers: faker.finance.creditCardNumber('################'),
      cardCvv: faker.finance.creditCardCVV(),
    }
    const events = emitter.fake()
    cleanup(() => {
      emitter.restore()
    })
    const output = await client.post('/purchase').json(input)
    expect(output.status()).toBe(201)
    events.assertEmitted('purchase:created')
  })

  test('should fail to generate purchase [invalid data]', async ({ client, expect }) => {
    const input = {
      clientName: faker.person.fullName(),
      clientEmail: faker.internet.email(),
      products: productIds,
      cardNumbers: faker.finance.creditCardNumber(),
      cardCvv: faker.finance.creditCardCVV(),
    }
    const output = await client.post('/purchase').json(input)
    expect(output.status()).toBe(422)
  })
})
