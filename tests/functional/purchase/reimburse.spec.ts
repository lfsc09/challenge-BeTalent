import Client from '#models/client'
import Transaction from '#models/transaction'
import emitter from '@adonisjs/core/services/emitter'
import { test } from '@japa/runner'
import User from '#models/user'
import { ClientFactory } from '#database/factories/client_factory'
import { GatewayFactory } from '#database/factories/gateway_factory'
import { TransactionFactory } from '#database/factories/transaction_factory'
import { TransactionProductFactory } from '#database/factories/transaction_product_factory'
import { generateUserToken } from '#tests/auth_generator'
import Gateway from '#models/gateway'
import Product from '#models/product'
import TransactionProduct from '#models/transaction_product'
import { ProductFactory } from '#database/factories/product_factory'

test.group('Purchase reimburse', (group) => {
  group.each.setup(async () => {
    await Client.query().delete()
    await Product.query().delete()
    await Gateway.query().delete()
    await Transaction.query().delete()
    await TransactionProduct.query().delete()
  })

  group.teardown(async () => {
    await User.query().delete()
  })

  test('should sucessfully reimburse purchase', async ({ client, expect, cleanup }) => {
    const token = await generateUserToken('ADMIN')
    const clientId = (await ClientFactory.create()).id
    const productId = (await ProductFactory.create()).id
    const gatewayId = (await GatewayFactory.create()).id
    const transactionId = (
      await TransactionFactory.merge({ clientId, gatewayId }).apply('approved').create()
    ).id
    await TransactionProductFactory.merge({ transactionId, productId }).create()
    const events = emitter.fake()
    cleanup(() => {
      emitter.restore()
    })
    const output = await client
      .post(`/reimburse/${transactionId}`)
      .header('Authorization', `Bearer ${token}`)
    expect(output.status()).toBe(200)
    events.assertEmitted('purchase:reimburse')
  })

  test('should fail to reimburse purchase [purchase not found]', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const output = await client
      .post(`/reimburse/${crypto.randomUUID()}`)
      .header('Authorization', `Bearer ${token}`)
    expect(output.status()).toBe(404)
  })
})
