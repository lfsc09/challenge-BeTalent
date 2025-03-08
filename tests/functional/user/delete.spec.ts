import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import { generateUserToken } from '#tests/auth_generator'
import { test } from '@japa/runner'

test.group('User delete', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should sucessfully delete user', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const userId = (await UserFactory.create()).id
    const output = await client
      .delete(`/users/${userId}`)
      .header('Authorization', `Bearer ${token}`)
    expect(output.status()).toBe(200)
  })

  test('should fail to delete user [user not found]', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const output = await client
      .delete(`/users/${crypto.randomUUID()}`)
      .header('Authorization', `Bearer ${token}`)
    expect(output.status()).toBe(404)
  })
})
