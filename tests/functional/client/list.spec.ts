import { test } from '@japa/runner'
import Client from '#models/client'

test.group('Client list', (group) => {
  group.each.setup(async () => {
    await Client.query().delete()
  })

  test('should return two clients', async ({ client, expect }) => {
    const input = [
      {
        id: crypto.randomUUID(),
        name: 'Client 1',
        email: 'client@adonis.com',
      },
      {
        id: crypto.randomUUID(),
        name: 'Cleitonis',
        email: 'cleitonius@adonis.com',
      },
    ]
    await Client.createMany(input)
    const output = await client.get('/clients')
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

  test('should return zero clients', async ({ client, expect }) => {
    const output = await client.get('/clients')
    expect(output.status()).toBe(200)
    expect(output.body()).toEqual([])
  })
})
