import Transaction from '#models/transaction'
import { test } from '@japa/runner'
import Client from '#models/client'
import User from '#models/user'
import { ClientFactory } from '#database/factories/client_factory'
import { generateUserToken } from '#tests/auth_generator'
import { TransactionFactory } from '#database/factories/transaction_factory'

test.group('Purchase list', (group) => {
  let clientId: string

  group.each.setup(async () => {
    await Client.query().delete()
    await Transaction.query().delete()
    clientId = (await ClientFactory.create()).id
  })

  group.teardown(async () => {
    await User.query().delete()
  })

  test('should return two purchases', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    await TransactionFactory.merge({ clientId }).apply('pending').createMany(2)
    const output = await client.get('/purchases').header('Authorization', `Bearer ${token}`)
    expect(output.status()).toBe(200)
    expect(output.body()).toHaveLength(2)
    for (let result of output.body()) {
      expect(result.id).toBeDefined()
      expect(result.status).toBeDefined()
      expect(result.amount).toBeDefined()
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()
    }
  })
})
