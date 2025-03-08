import Product from '#models/product'
import User from '#models/user'
import { test } from '@japa/runner'
import { Faker, pt_BR } from '@faker-js/faker'
import { ProductFactory } from '#database/factories/product_factory'
import { generateUserToken } from '#tests/auth_generator'

test.group('Product edit', (group) => {
  const faker = new Faker({ locale: [pt_BR] })
  let productId: string

  group.each.setup(async () => {
    await Product.query().delete()
    productId = (await ProductFactory.create()).id
  })

  group.teardown(async () => {
    await User.query().delete()
  })

  test('should sucessfully edit product', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      name: faker.commerce.productName(),
    }
    const output = await client
      .put(`/products/${productId}`)
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(200)
  })

  test('should fail to edit product [invalid data]', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      amount: faker.number.float({ min: 1.0, max: 10.0, fractionDigits: 2 }) * -1,
    }
    const output = await client
      .put(`/products/${productId}`)
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(422)
  })

  test('should fail to edit product [product not found]', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      name: faker.commerce.productName(),
    }
    const output = await client
      .put(`/products/${crypto.randomUUID()}`)
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(404)
  })
})
