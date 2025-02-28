import User from '#models/user'
import { test } from '@japa/runner'

test.group('User list', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should return two users', async ({ client, expect }) => {
    const input = [
      {
        email: 'user@adonis.com',
        password: 'password',
        role: 'USER',
      },
      {
        email: 'finance@adonis.com',
        password: 'password',
        role: 'FINANCE',
      },
    ]
    await User.createMany(input)
    const output = await client.get('/users')
    expect(output.status()).toBe(200)
    expect(output.body()).toHaveLength(2)
    for (let result of output.body()) {
      expect(result.id).toBeDefined()
      expect(result.email).toBeDefined()
      expect(result.role).toBeDefined()
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()
    }
  })

  test('should return zero users', async ({ client, expect }) => {
    const output = await client.get('/users')
    expect(output.status()).toBe(200)
    expect(output.body()).toEqual([])
  })
})
