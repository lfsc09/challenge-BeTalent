import Product from '#models/product'
import { test } from '@japa/runner'
import Big from 'big.js'

test.group('Product delete', (group) => {
  group.each.setup(async () => {
    await Product.query().delete()
  })

  test('should sucessfully delete product', async ({ client, expect }) => {
    const product = await Product.create({
      name: 'product',
      amount: new Big(100.5),
    })
    const productId = product.id
    const output = await client.delete(`/products/${productId}`)
    expect(output.status()).toBe(200)
  })

  test('should fail to delete product [product not found]', async ({ client, expect }) => {
    const output = await client.delete(`/products/${crypto.randomUUID()}`)
    expect(output.status()).toBe(404)
  })
})
