import Client from '#models/client'
import Transaction from '#models/transaction'
import emitter from '@adonisjs/core/services/emitter'
import { test } from '@japa/runner'
import Big from 'big.js'
import { TransactionStatus } from '../../../app/entities/transaction.js'
import { DateTime } from 'luxon'

test.group('Purchase reimburse', (group) => {
  group.each.setup(async () => {
    await Client.query().delete()
    await Transaction.query().delete()
  })

  test('should sucessfully reimburse purchase', async ({ client, expect, cleanup }) => {
    const clientId = (
      await Client.create({
        name: 'Client',
        email: 'client@adonius.com',
      })
    ).id
    const transactionId = (
      await Transaction.create({
        id: crypto.randomUUID(),
        clientId,
        status: TransactionStatus.APPROVED,
        amount: new Big(100),
        cardNumbers: '1234567890123456',
        cardCvv: '010',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      })
    ).id
    const events = emitter.fake()
    cleanup(() => {
      emitter.restore()
    })
    const output = await client.post(`/reimburse/${transactionId}`)
    expect(output.status()).toBe(200)
    events.assertEmitted('purchase:reimburse')
  })

  test('should fail to reimburse purchase [purchase not found]', async ({ client, expect }) => {
    const output = await client.post(`/reimburse/${crypto.randomUUID()}`)
    expect(output.status()).toBe(404)
  })
})
