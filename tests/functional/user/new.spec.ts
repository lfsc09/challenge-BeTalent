import User from '#models/user'
import { generateUserToken } from '#tests/auth_generator'
import { test } from '@japa/runner'
import { Faker, pt_BR } from '@faker-js/faker'

test.group('User new', (group) => {
  const faker = new Faker({ locale: [pt_BR] })

  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should sucessfully create user', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
      role: faker.helpers.arrayElement(['USER', 'FINANCE', 'MANAGER', 'ADMIN']),
    }
    const output = await client
      .post('/users')
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(201)
  })

  test('should fail to create user [invalid data]', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 5 }),
      role: faker.helpers.arrayElement(['USER', 'FINANCE', 'MANAGER', 'ADMIN']),
    }
    const output = await client
      .post('/users')
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(422)
  })
})
