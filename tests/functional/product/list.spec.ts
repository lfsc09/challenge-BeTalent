import Product from '#models/product'
import { test } from '@japa/runner'
import Big from 'big.js'

test.group('Product list', (group) => {
  group.each.setup(async () => {
    await Product.query().delete()
  })

  test('should return two products', async ({ client, expect }) => {
    const input = [
      {
        name: 'product 1',
        amount: new Big(100.5),
      },
      {
        name: 'product 2',
        amount: new Big(10),
      },
    ]
    await Product.createMany(input)
    const output = await client.get('/products')
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

  test('should return zero products', async ({ client, expect }) => {
    const output = await client.get('/products')
    expect(output.status()).toBe(200)
    expect(output.body()).toEqual([])
  })
})
