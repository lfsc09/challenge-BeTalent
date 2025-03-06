import Client from '#models/client'
import Transaction from '#models/transaction'
import { test } from '@japa/runner'
import Big from 'big.js'
import { DateTime } from 'luxon'
import { TransactionStatus } from '../../../app/entities/transaction.js'

test.group('Client details', (group) => {
  let clientId: string

  group.each.setup(async () => {
    await Client.query().delete()
    await Transaction.query().delete()
    clientId = (await Client.create({ name: 'client 1', email: 'client@adonis.com' })).id
  })

  test('should return a detailed client information', async ({ client, expect }) => {
    const input = {
      id: crypto.randomUUID(),
      clientId: clientId,
      status: TransactionStatus.CREATED,
      amount: new Big(10),
      cardNumbers: '5569000000006063',
      cardCvv: '010',
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    }
    await Transaction.create(input)
    const output = await client.get(`/clients/${clientId}`)
    expect(output.status()).toBe(200)
    expect(output.body().id).toBeDefined()
    expect(output.body().name).toBeDefined()
    expect(output.body().email).toBeDefined()
    expect(output.body().purchases).toBeDefined()
    expect(output.body().purchases).toHaveLength(1)
  })

  test('should fail to return detailed client information [client not found]', async ({
    client,
    expect,
  }) => {
    const output = await client.get(`/clients/${crypto.randomUUID()}`)
    expect(output.status()).toBe(404)
  })
})
