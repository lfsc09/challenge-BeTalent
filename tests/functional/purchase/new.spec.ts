import Product from '#models/product'
import { test } from '@japa/runner'
import { randomInt } from 'crypto'
import Big from 'big.js'
import Client from '#models/client'
import Transaction from '#models/transaction'
import emitter from '@adonisjs/core/services/emitter'
import TransactionProduct from '#models/transaction_product'

test.group('Purchase new', (group) => {
  let productIds: string[] = []

  group.each.setup(async () => {
    await Client.query().delete()
    await Product.query().delete()
    await Transaction.query().delete()
    await TransactionProduct.query().delete()
    const createdProducts = await Product.createMany([
      { name: 'product1', amount: new Big(10) },
      { name: 'product2', amount: new Big(5.5) },
    ])
    productIds = createdProducts.map((product) => product.id)
  })

  test('should sucessfully generate purchase', async ({ client, expect, cleanup }) => {
    const input = {
      clientName: 'client',
      clientEmail: 'client@adonis.com',
      products: productIds.map((id) => ({
        productId: id,
        quantity: randomInt(10) + 1,
      })),
      cardNumbers: '1234567890123456',
      cardCvv: '010',
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
      clientName: 'client',
      clientEmail: 'client@adonis.com',
      products: productIds,
    }
    const output = await client.post('/purchase').json(input)
    expect(output.status()).toBe(422)
  })
})
