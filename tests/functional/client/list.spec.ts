import { test } from '@japa/runner'
import Client from '#models/client'
import { ClientFactory } from '#database/factories/client_factory'
import { generateUserToken } from '#tests/auth_generator'
import User from '#models/user'

test.group('Client list', (group) => {
  group.each.setup(async () => {
    await Client.query().delete()
  })

  group.teardown(async () => {
    await User.query().delete()
  })

  test('should return two clients', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    await ClientFactory.createMany(2)
    const output = await client.get('/clients').header('Authorization', `Bearer ${token}`)
    expect(output.status()).toBe(200)
    expect(output.body()).toHaveLength(2)
    for (let result of output.body()) {
      expect(result.id).toBeDefined()
      expect(result.name).toBeDefined()
      expect(result.email).toBeDefined()
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()
    }
  })
})
