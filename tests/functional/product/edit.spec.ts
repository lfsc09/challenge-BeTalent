import Product from '#models/product'
import { test } from '@japa/runner'
import Big from 'big.js'

test.group('Product edit', (group) => {
  let productId: string

  group.each.setup(async () => {
    await Product.query().delete()
    const product = await Product.create({
      name: 'product',
      amount: new Big(100.75),
    })
    productId = product.id
  })

  test('should sucessfully edit product', async ({ client, expect }) => {
    const input = {
      name: 'product edited',
    }
    const output = await client.put(`/products/${productId}`).json(input)
    expect(output.status()).toBe(200)
  })

  test('should fail to edit product [invalid data]', async ({ client, expect }) => {
    const input = {
      amount: 'invalid',
    }
    const output = await client.put(`/products/${productId}`).json(input)
    expect(output.status()).toBe(422)
  })

  test('should fail to edit product [product not found]', async ({ client, expect }) => {
    const input = {
      name: 'product edited',
    }
    const output = await client.put(`/products/${crypto.randomUUID()}`).json(input)
    expect(output.status()).toBe(404)
  })
})
