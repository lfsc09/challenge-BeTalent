import User from '#models/user'
import { test } from '@japa/runner'
import { Faker, pt_BR } from '@faker-js/faker'
import { generateUserToken } from '#tests/auth_generator'
import { UserFactory } from '#database/factories/user_factory'

test.group('User edit', (group) => {
  const faker = new Faker({ locale: [pt_BR] })
  let userId: string

  group.each.setup(async () => {
    await User.query().delete()
    userId = (await UserFactory.create()).id
  })

  test('should sucessfully edit user', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      password: faker.internet.password({ length: 8 }),
    }
    const output = await client
      .put(`/users/${userId}`)
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(200)
  })

  test('should fail to edit user [invalid data]', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      password: faker.internet.password({ length: 4 }),
    }
    const output = await client
      .put(`/users/${userId}`)
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(422)
  })

  test('should fail to edit user [user not found]', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      password: faker.internet.password({ length: 8 }),
    }
    const output = await client
      .put(`/users/${crypto.randomUUID()}`)
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(404)
  })
})
