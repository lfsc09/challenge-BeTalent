import User from '#models/user'
import { test } from '@japa/runner'

test.group('User edit', (group) => {
  let userId: string

  group.each.setup(async () => {
    await User.query().delete()
    const user = await User.create({
      email: 'user@adonis.com',
      password: 'password',
      role: 'USER',
    })
    userId = user.id
  })

  test('should sucessfully edit user', async ({ client, expect }) => {
    const input = {
      role: 'ADMIN',
    }
    const output = await client.put(`/users/${userId}`).json(input)
    expect(output.status()).toBe(200)
  })

  test('should fail to edit user [invalid data]', async ({ client, expect }) => {
    const input = {
      password: 'passw',
    }
    const output = await client.put(`/users/${userId}`).json(input)
    expect(output.status()).toBe(422)
  })

  test('should fail to edit user [user not found]', async ({ client, expect }) => {
    const input = {
      password: 'password',
    }
    const output = await client.put(`/users/${crypto.randomUUID()}`).json(input)
    expect(output.status()).toBe(404)
  })
})
