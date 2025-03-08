import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import { generateUserToken } from '#tests/auth_generator'
import { test } from '@japa/runner'

test.group('User list', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should return two users', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    await UserFactory.createMany(2)
    const output = await client.get('/users').header('Authorization', `Bearer ${token}`)
    expect(output.status()).toBe(200)
    // Should expect 3 users, because there will also be the user that created the token
    expect(output.body()).toHaveLength(3)
    for (let result of output.body()) {
      expect(result.id).toBeDefined()
      expect(result.email).toBeDefined()
      expect(result.role).toBeDefined()
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()
    }
  })
})
