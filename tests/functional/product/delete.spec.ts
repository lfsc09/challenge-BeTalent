import { ProductFactory } from '#database/factories/product_factory'
import Product from '#models/product'
import User from '#models/user'
import { generateUserToken } from '#tests/auth_generator'
import { test } from '@japa/runner'

test.group('Product delete', (group) => {
  group.each.setup(async () => {
    await Product.query().delete()
  })

  group.teardown(async () => {
    await User.query().delete()
  })

  test('should sucessfully delete product', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const productId = (await ProductFactory.create()).id
    const output = await client
      .delete(`/products/${productId}`)
      .header('Authorization', `Bearer ${token}`)
    expect(output.status()).toBe(200)
  })

  test('should fail to delete product [product not found]', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const output = await client
      .delete(`/products/${crypto.randomUUID()}`)
      .header('Authorization', `Bearer ${token}`)
    expect(output.status()).toBe(404)
  })
})
