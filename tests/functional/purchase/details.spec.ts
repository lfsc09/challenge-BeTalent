import Client from '#models/client'
import Gateway from '#models/gateway'
import Product from '#models/product'
import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import { test } from '@japa/runner'
import User from '#models/user'
import { ClientFactory } from '#database/factories/client_factory'
import { GatewayFactory } from '#database/factories/gateway_factory'
import { ProductFactory } from '#database/factories/product_factory'
import { generateUserToken } from '#tests/auth_generator'
import { TransactionFactory } from '#database/factories/transaction_factory'
import { TransactionProductFactory } from '#database/factories/transaction_product_factory'

test.group('Purchase details', (group) => {
  let clientId: string
  let gatewayId: string
  let productId: string

  group.each.setup(async () => {
    await Client.query().delete()
    await Product.query().delete()
    await Gateway.query().delete()
    await Transaction.query().delete()
    await TransactionProduct.query().delete()
    clientId = (await ClientFactory.create()).id
    gatewayId = (await GatewayFactory.create()).id
    productId = (await ProductFactory.create()).id
  })

  group.teardown(async () => {
    await User.query().delete()
  })

  test('should return a detailed purchase', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const transactionId = (
      await TransactionFactory.merge({ clientId, gatewayId }).apply('approved').create()
    ).id
    await TransactionProductFactory.merge({ transactionId, productId }).create()
    const output = await client
      .get(`/purchases/${transactionId}`)
      .header('Authorization', `Bearer ${token}`)
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
    const token = await generateUserToken('ADMIN')
    const output = await client
      .get(`/purchases/${crypto.randomUUID()}`)
      .header('Authorization', `Bearer ${token}`)
    expect(output.status()).toBe(404)
  })
})
