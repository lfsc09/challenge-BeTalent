import { GatewayFactory } from '#database/factories/gateway_factory'
import Gateway from '#models/gateway'
import User from '#models/user'
import { generateUserToken } from '#tests/auth_generator'
import { Faker, pt_BR } from '@faker-js/faker'
import { test } from '@japa/runner'

test.group('Gateway edit', (group) => {
  const faker = new Faker({ locale: [pt_BR] })
  let gatewayId: string

  group.each.setup(async () => {
    await Gateway.query().delete()
    gatewayId = (await GatewayFactory.create()).id
  })

  group.teardown(async () => {
    await User.query().delete()
  })

  test('should sucessfully edit isActive', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      isActive: faker.datatype.boolean(),
    }
    const output = await client
      .put(`/gateways/${gatewayId}/active`)
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(200)
  })

  test('should fail to edit isActive [invalid data]', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      isActive: 'false',
    }
    const output = await client
      .put(`/gateways/${gatewayId}/active`)
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(422)
  })

  test('should fail to edit isActive [gateway not found]', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      isActive: faker.datatype.boolean(),
    }
    const output = await client
      .put(`/gateways/${crypto.randomUUID()}/active`)
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(404)
  })

  test('should sucessfully edit priority', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      priority: faker.number.int({ min: 1, max: 10 }),
    }
    const output = await client
      .put(`/gateways/${gatewayId}/priority`)
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(200)
  })

  test('should fail to edit priority [invalid data]', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      priority: 'a',
    }
    const output = await client
      .put(`/gateways/${gatewayId}/priority`)
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(422)
  })

  test('should fail to edit priority [gateway not found]', async ({ client, expect }) => {
    const token = await generateUserToken('ADMIN')
    const input = {
      priority: faker.number.int({ min: 1, max: 10 }),
    }
    const output = await client
      .put(`/gateways/${crypto.randomUUID()}/priority`)
      .header('Authorization', `Bearer ${token}`)
      .json(input)
    expect(output.status()).toBe(404)
  })
})
