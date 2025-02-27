import Product from '#models/product'
import { test } from '@japa/runner'

test.group('Product new', (group) => {
  group.each.setup(async () => {
    await Product.query().delete()
  })

  test('should sucessfully create product', async ({ client, expect }) => {
    const input = {
      name: 'product',
      amount: 100.5,
    }
    const output = await client.post('/products').json(input)
    expect(output.status()).toBe(201)
  })

  test('should fail to create product [invalid data]', async ({ client, expect }) => {
    const input = {
      name: '',
      amount: 100.5,
    }
    const output = await client.post('/products').json(input)
    expect(output.status()).toBe(422)
  })
})
