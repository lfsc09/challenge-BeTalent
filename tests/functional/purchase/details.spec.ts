import Client from '#models/client'
import Gateway from '#models/gateway'
import Product from '#models/product'
import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import { test } from '@japa/runner'
import Big from 'big.js'
import { TransactionStatus } from '../../../app/entities/transaction.js'
import { DateTime } from 'luxon'

test.group('Purchase details', (group) => {
  let clientId: string
  let gatewayId: string
  let productId: string

  group.each.setup(async () => {
    await Client.query().delete()
    await Product.query().delete()
    await Transaction.query().delete()
    await TransactionProduct.query().delete()
    await Gateway.query().delete()
    clientId = (await Client.create({ name: 'client 1', email: 'client@adonis.com' })).id
    gatewayId = (
      await Gateway.create({
        name: 'gateway 1',
        isActive: true,
        priority: 1,
        gatewayModule: 'gateway',
      })
    ).id
    productId = (await Product.create({ name: 'product 1', amount: new Big(10) })).id
  })

  test('should return a detailed purchase', async ({ client, expect }) => {
    const input = {
      id: crypto.randomUUID(),
      clientId: clientId,
      status: TransactionStatus.CREATED,
      amount: new Big(10),
      cardNumbers: '5569000000006063',
      cardCvv: '010',
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    }
    await Transaction.create(input)
    await TransactionProduct.create({
      transactionId: input.id,
      productId: productId,
      quantity: 1,
    })
    const output = await client.get(`/purchases/${input.id}`)
    expect(output.status()).toBe(200)
    expect(output.body().id).toBeDefined()
    expect(output.body().clientName).toBeDefined()
    expect(output.body().clientEmail).toBeDefined()
    expect(output.body().gatewayName).toBeDefined()
    expect(output.body().externalId).toBeDefined()
    expect(output.body().status).toBeDefined()
    expect(output.body().amount).toBeDefined()
    expect(output.body().products).toBeDefined()
    expect(output.body().products).toHaveLength(1)
    expect(output.body().createdAt).toBeDefined()
    expect(output.body().updatedAt).toBeDefined()
  })

  test('should fail to return detailed purchase [purchase not found]', async ({
    client,
    expect,
  }) => {
    const output = await client.get(`/purchases/${crypto.randomUUID()}`)
    expect(output.status()).toBe(404)
  })
})
