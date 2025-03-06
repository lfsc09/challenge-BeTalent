import Transaction from '#models/transaction'
import { test } from '@japa/runner'
import Big from 'big.js'
import { TransactionStatus } from '../../../app/entities/transaction.js'
import { DateTime } from 'luxon'
import Client from '#models/client'

test.group('Purchase list', (group) => {
  let clientId: string

  group.each.setup(async () => {
    await Client.query().delete()
    await Transaction.query().delete()
    clientId = (
      await Client.create({
        name: 'client1',
        email: 'client@adonis.com',
      })
    ).id
  })

  test('should return two purchases', async ({ client, expect }) => {
    const input = [
      {
        id: crypto.randomUUID(),
        clientId: clientId,
        status: TransactionStatus.CREATED,
        amount: new Big(10),
        cardNumbers: '5569000000006063',
        cardCvv: '010',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      },
      {
        id: crypto.randomUUID(),
        clientId: clientId,
        status: TransactionStatus.PENDING,
        amount: new Big(20),
        cardNumbers: '5569000000006063',
        cardCvv: '010',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      },
    ]
    await Transaction.createMany(input)
    const output = await client.get('/purchases')
    expect(output.status()).toBe(200)
    expect(output.body()).toHaveLength(2)
    for (let result of output.body()) {
      expect(result.id).toBeDefined()
      expect(result.status).toBeDefined()
      expect(result.amount).toBeDefined()
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()
    }
  })

  test('should return zero purchases', async ({ client, expect }) => {
    const output = await client.get('/purchases')
    expect(output.status()).toBe(200)
    expect(output.body()).toEqual([])
  })
})
