import { ProductFactory } from '#database/factories/product_factory'
import Product from '#models/product'
import User from '#models/user'
import { generateUserToken } from '#tests/auth_generator'
import { test } from '@japa/runner'

test.group('Product list', (group) => {
  group.each.setup(async () => {
    await Product.query().delete()
  })

  group.teardown(async () => {
    await User.query().delete()
  })

  test('should return two products', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    await ProductFactory.createMany(2)
    const output = await client.get('/products').header('Authorization', `Bearer ${token}`)
    expect(output.status()).toBe(200)
    expect(output.body()).toHaveLength(2)
    for (let result of output.body()) {
      expect(result.id).toBeDefined()
      expect(result.name).toBeDefined()
      expect(result.amount).toBeDefined()
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()
    }
  })
})
