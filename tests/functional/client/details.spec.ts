import Client from '#models/client'
import Transaction from '#models/transaction'
import User from '#models/user'
import { test } from '@japa/runner'
import { generateUserToken } from '#tests/auth_generator'
import { TransactionFactory } from '#database/factories/transaction_factory'
import { ClientFactory } from '#database/factories/client_factory'

test.group('Client details', (group) => {
  let clientId: string

  group.each.setup(async () => {
    await Client.query().delete()
    await Transaction.query().delete()
    clientId = (await ClientFactory.create()).id
  })

  group.teardown(async () => {
    await User.query().delete()
  })

  test('should return a detailed client information', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    await TransactionFactory.merge({ clientId }).create()
    const output = await client
      .get(`/clients/${clientId}`)
      .header('Authorization', `Bearer ${token}`)
    expect(output.status()).toBe(200)
    expect(output.body().id).toBeDefined()
    expect(output.body().name).toBeDefined()
    expect(output.body().email).toBeDefined()
    expect(output.body().purchases).toBeDefined()
    expect(output.body().purchases).toHaveLength(1)
  })

  test('should fail to return detailed client information [client not found]', async ({
    client,
    expect,
  }) => {
    const token = await generateUserToken('ADMIN')
    const output = await client
      .get(`/clients/${crypto.randomUUID()}`)
      .header('Authorization', `Bearer ${token}`)
    expect(output.status()).toBe(404)
  })
})
