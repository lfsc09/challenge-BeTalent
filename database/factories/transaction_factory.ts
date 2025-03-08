import factory from '@adonisjs/lucid/factories'
import Transaction from '#models/transaction'
import Big from 'big.js'
import { DateTime } from 'luxon'
import { TransactionStatus } from '../../app/entities/transaction.js'

export const TransactionFactory = factory
  .define(Transaction, async ({ faker }) => {
    return {
      id: faker.string.uuid(),
      clientId: faker.string.uuid(),
      status: TransactionStatus.CREATED,
      amount: new Big(faker.number.float({ min: 1.0, max: 100.0, fractionDigits: 2 })),
      cardNumbers: faker.finance.creditCardNumber('################'),
      cardCvv: faker.finance.creditCardCVV(),
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    }
  })
  .state('pending', (t) => (t.status = TransactionStatus.PENDING))
  .state('approved', (t) => {
    t.status = TransactionStatus.APPROVED
    if (!t.gatewayId) t.gatewayId = crypto.randomUUID()
    if (!t.externalId) t.externalId = crypto.randomUUID()
  })
  .state('refunded', (t) => {
    t.status = TransactionStatus.REFUNDED
    if (!t.gatewayId) t.gatewayId = crypto.randomUUID()
    if (!t.externalId) t.externalId = crypto.randomUUID()
  })
  .build()
