import User from '#models/user'
import { test } from '@japa/runner'

test.group('User new', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should sucessfully create user', async ({ client, expect }) => {
    const input = {
      email: 'user@adonis.com',
      password: 'password',
      role: 'USER',
    }
    const output = await client.post('/users').json(input)
    expect(output.status()).toBe(201)
  })

  test('should fail to create user [invalid data]', async ({ client, expect }) => {
    const input = {
      email: 'user',
      password: 'password',
      role: 'USER',
    }
    const output = await client.post('/users').json(input)
    expect(output.status()).toBe(422)
  })
})
