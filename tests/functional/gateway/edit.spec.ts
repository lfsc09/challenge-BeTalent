import Gateway from '#models/gateway'
import { test } from '@japa/runner'

test.group('Gateway edit', (group) => {
  let gatewayId: string

  group.each.setup(async () => {
    await Gateway.query().delete()
    const gateway = await Gateway.create({
      name: 'Gateway',
      isActive: true,
      priority: 1,
      gatewayModule: 'gateway',
    })
    gatewayId = gateway.id
  })

  test('should sucessfully edit isActive', async ({ client, expect }) => {
    const input = {
      isActive: false,
    }
    const output = await client.put(`/gateways/${gatewayId}/active`).json(input)
    expect(output.status()).toBe(200)
  })

  test('should fail to edit isActive [invalid data]', async ({ client, expect }) => {
    const input = {
      isActive: 'false',
    }
    const output = await client.put(`/gateways/${gatewayId}/active`).json(input)
    expect(output.status()).toBe(422)
  })

  test('should fail to edit isActive [gateway not found]', async ({ client, expect }) => {
    const input = {
      isActive: false,
    }
    const output = await client.put(`/gateways/${crypto.randomUUID()}/active`).json(input)
    expect(output.status()).toBe(404)
  })

  test('should sucessfully edit priority', async ({ client, expect }) => {
    const input = {
      priority: 5,
    }
    const output = await client.put(`/gateways/${gatewayId}/priority`).json(input)
    expect(output.status()).toBe(200)
  })

  test('should fail to edit priority [invalid data]', async ({ client, expect }) => {
    const input = {
      priority: 'asdf',
    }
    const output = await client.put(`/gateways/${gatewayId}/priority`).json(input)
    expect(output.status()).toBe(422)
  })

  test('should fail to edit priority [gateway not found]', async ({ client, expect }) => {
    const input = {
      priority: 5,
    }
    const output = await client.put(`/gateways/${crypto.randomUUID()}/priority`).json(input)
    expect(output.status()).toBe(404)
  })
})
