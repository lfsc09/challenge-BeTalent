import Product from '#models/product'
import User from '#models/user'
import { test } from '@japa/runner'
import { Faker, pt_BR } from '@faker-js/faker'
import { generateUserToken } from '#tests/auth_generator'

test.group('Product new', (group) => {
  const faker = new Faker({ locale: [pt_BR] })

  group.each.setup(async () => {
    await Product.query().delete()
  })

  group.teardown(async () => {
    await User.query().delete()
  })

  test('should sucessfully create product', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      name: faker.commerce.productName(),
      amount: faker.number.float({ min: 1.0, max: 100.0, fractionDigits: 2 }),
    }
    const output = await client
      .post('/products')
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(201)
  })

  test('should fail to create product [invalid data]', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      name: '',
      amount: faker.number.float({ min: 1.0, max: 100.0, fractionDigits: 2 }),
    }
    const output = await client
      .post('/products')
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(422)
  })
})
