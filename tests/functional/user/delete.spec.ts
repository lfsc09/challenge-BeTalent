import User from '#models/user'
import { test } from '@japa/runner'

test.group('User delete', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should sucessfully delete user', async ({ client, expect }) => {
    const user = await User.create({
      email: 'user@adonis.com',
      password: 'password',
      role: 'USER',
    })
    const userId = user.id
    const output = await client.delete(`/users/${userId}`)
    expect(output.status()).toBe(200)
  })

  test('should fail to delete user [user not found]', async ({ client, expect }) => {
    const output = await client.delete(`/users/${crypto.randomUUID()}`)
    expect(output.status()).toBe(404)
  })
})
