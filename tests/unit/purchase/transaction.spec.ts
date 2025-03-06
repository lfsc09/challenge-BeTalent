import { test } from '@japa/runner'
import Big from 'big.js'
import Transaction, { TransactionStatus } from '../../../app/entities/transaction.js'
import { DateTime } from 'luxon'
import { setTimeout } from 'node:timers/promises'

test.group('Purchase transaction', () => {
  test('should create a transaction sucessfully', async ({ expect }) => {
    const input = {
      clientId: crypto.randomUUID(),
      clientName: 'Client',
      clientEmail: 'client@adonis.com',
      products: [
        {
          id: crypto.randomUUID(),
          quantity: 2,
          amount: new Big(100),
        },
      ],
      cardNumbers: '5569000000006063',
      cardCvv: '010',
    }
    const transaction = Transaction.create(
      input.clientId,
      input.clientName,
      input.clientEmail,
      input.products,
      input.cardNumbers,
      input.cardCvv
    )
    expect(transaction.getId()).toBeDefined()
    expect(transaction.getClientId()).toBe(input.clientId)
    expect(transaction.getClientName()).toBe(input.clientName)
    expect(transaction.getClientEmail()).toBe(input.clientEmail)
    expect(transaction.getAmount().toString()).toBe('200')
    expect(transaction.getProducts()).toEqual(
      input.products.map((product) => ({ productId: product.id, quantity: product.quantity }))
    )
    expect(transaction.getGatewayId()).toBeUndefined()
    expect(transaction.getExternalId()).toBeUndefined()
    expect(transaction.getStatus()).toBe(TransactionStatus.CREATED)
    expect(transaction.getCardNumbers()).toBe(input.cardNumbers)
    expect(transaction.getCardCvv()).toBe(input.cardCvv)
    expect(transaction.getCardLastNumbers()).toBe(input.cardNumbers.slice(-4))
    expect(transaction.getCreatedAt()).toBeDefined()
    expect(transaction.getUpdatedAt()).toBeDefined()
  })

  test('should restore a "CREATED" transaction sucessfully', async ({ expect }) => {
    const input = {
      id: crypto.randomUUID(),
      clientId: crypto.randomUUID(),
      clientName: 'Client',
      clientEmail: 'client@adonis.com',
      amount: new Big(200),
      products: [
        {
          productId: crypto.randomUUID(),
          quantity: 2,
        },
      ],
      gatewayId: '',
      externalId: '',
      status: TransactionStatus.CREATED,
      cardNumbers: '5569000000006063',
      cardCvv: '010',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    }
    const transaction = Transaction.restore(
      input.id,
      input.clientId,
      input.clientName,
      input.clientEmail,
      input.amount,
      input.products,
      input.gatewayId,
      input.externalId,
      input.status,
      input.cardNumbers,
      input.cardCvv,
      input.createdAt,
      input.updatedAt
    )
    expect(transaction.getId()).toBe(input.id)
    expect(transaction.getClientId()).toBe(input.clientId)
    expect(transaction.getClientName()).toBe(input.clientName)
    expect(transaction.getClientEmail()).toBe(input.clientEmail)
    expect(transaction.getAmount().toString()).toBe('200')
    expect(transaction.getProducts()).toEqual(input.products)
    expect(transaction.getGatewayId()).toBeUndefined()
    expect(transaction.getExternalId()).toBeUndefined()
    expect(transaction.getStatus()).toBe(input.status)
    expect(transaction.getCardNumbers()).toBe(input.cardNumbers)
    expect(transaction.getCardCvv()).toBe(input.cardCvv)
    expect(transaction.getCreatedAt()).toBe(input.createdAt)
    expect(transaction.getUpdatedAt()).toBe(input.updatedAt)
  })

  test('should restore a "PENDING" transaction sucessfully', async ({ expect }) => {
    const input = {
      id: crypto.randomUUID(),
      clientId: crypto.randomUUID(),
      clientName: 'Client',
      clientEmail: 'client@adonis.com',
      amount: new Big(200),
      products: [
        {
          productId: crypto.randomUUID(),
          quantity: 2,
        },
      ],
      gatewayId: '',
      externalId: '',
      status: TransactionStatus.PENDING,
      cardNumbers: '5569000000006063',
      cardCvv: '010',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    }
    const transaction = Transaction.restore(
      input.id,
      input.clientId,
      input.clientName,
      input.clientEmail,
      input.amount,
      input.products,
      input.gatewayId,
      input.externalId,
      input.status,
      input.cardNumbers,
      input.cardCvv,
      input.createdAt,
      input.updatedAt
    )
    expect(transaction.getId()).toBe(input.id)
    expect(transaction.getClientId()).toBe(input.clientId)
    expect(transaction.getClientName()).toBe(input.clientName)
    expect(transaction.getClientEmail()).toBe(input.clientEmail)
    expect(transaction.getAmount().toString()).toBe('200')
    expect(transaction.getProducts()).toEqual(input.products)
    expect(transaction.getGatewayId()).toBeUndefined()
    expect(transaction.getExternalId()).toBeUndefined()
    expect(transaction.getStatus()).toBe(input.status)
    expect(transaction.getCardNumbers()).toBe(input.cardNumbers)
    expect(transaction.getCardCvv()).toBe(input.cardCvv)
    expect(transaction.getCreatedAt()).toBe(input.createdAt)
    expect(transaction.getUpdatedAt()).toBe(input.updatedAt)
  })

  test('should restore a "APPROVED" transaction sucessfully', async ({ expect }) => {
    const input = {
      id: crypto.randomUUID(),
      clientId: crypto.randomUUID(),
      clientName: 'Client',
      clientEmail: 'client@adonis.com',
      amount: new Big(200),
      products: [
        {
          productId: crypto.randomUUID(),
          quantity: 2,
        },
      ],
      gatewayId: crypto.randomUUID(),
      externalId: crypto.randomUUID(),
      status: TransactionStatus.APPROVED,
      cardNumbers: '5569000000006063',
      cardCvv: '010',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    }
    const transaction = Transaction.restore(
      input.id,
      input.clientId,
      input.clientName,
      input.clientEmail,
      input.amount,
      input.products,
      input.gatewayId,
      input.externalId,
      input.status,
      input.cardNumbers,
      input.cardCvv,
      input.createdAt,
      input.updatedAt
    )
    expect(transaction.getId()).toBe(input.id)
    expect(transaction.getClientId()).toBe(input.clientId)
    expect(transaction.getClientName()).toBe(input.clientName)
    expect(transaction.getClientEmail()).toBe(input.clientEmail)
    expect(transaction.getAmount().toString()).toBe('200')
    expect(transaction.getProducts()).toEqual(input.products)
    expect(transaction.getGatewayId()).toBe(input.gatewayId)
    expect(transaction.getExternalId()).toBe(input.externalId)
    expect(transaction.getStatus()).toBe(input.status)
    expect(transaction.getCardNumbers()).toBe(input.cardNumbers)
    expect(transaction.getCardCvv()).toBe(input.cardCvv)
    expect(transaction.getCreatedAt()).toBe(input.createdAt)
    expect(transaction.getUpdatedAt()).toBe(input.updatedAt)
  })

  test('should restore a "REFUNDED" transaction sucessfully', async ({ expect }) => {
    const input = {
      id: crypto.randomUUID(),
      clientId: crypto.randomUUID(),
      clientName: 'Client',
      clientEmail: 'client@adonis.com',
      amount: new Big(200),
      products: [
        {
          productId: crypto.randomUUID(),
          quantity: 2,
        },
      ],
      gatewayId: crypto.randomUUID(),
      externalId: crypto.randomUUID(),
      status: TransactionStatus.REFUNDED,
      cardNumbers: '5569000000006063',
      cardCvv: '010',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    }
    const transaction = Transaction.restore(
      input.id,
      input.clientId,
      input.clientName,
      input.clientEmail,
      input.amount,
      input.products,
      input.gatewayId,
      input.externalId,
      input.status,
      input.cardNumbers,
      input.cardCvv,
      input.createdAt,
      input.updatedAt
    )
    expect(transaction.getId()).toBe(input.id)
    expect(transaction.getClientId()).toBe(input.clientId)
    expect(transaction.getClientName()).toBe(input.clientName)
    expect(transaction.getClientEmail()).toBe(input.clientEmail)
    expect(transaction.getAmount().toString()).toBe('200')
    expect(transaction.getProducts()).toEqual(input.products)
    expect(transaction.getGatewayId()).toBe(input.gatewayId)
    expect(transaction.getExternalId()).toBe(input.externalId)
    expect(transaction.getStatus()).toBe(input.status)
    expect(transaction.getCardNumbers()).toBe(input.cardNumbers)
    expect(transaction.getCardCvv()).toBe(input.cardCvv)
    expect(transaction.getCreatedAt()).toBe(input.createdAt)
    expect(transaction.getUpdatedAt()).toBe(input.updatedAt)
  })

  test('should start processing payment', async ({ expect }) => {
    const transaction = Transaction.create(
      crypto.randomUUID(),
      'Client',
      'client@adonis.com',
      [
        {
          id: crypto.randomUUID(),
          quantity: 2,
          amount: new Big(100),
        },
      ],
      '5569000000006063',
      '010'
    )
    const updatedAt = transaction.getUpdatedAt()
    await setTimeout(50)
    const output = transaction.startProcessingPayment()
    expect(output).toBeTruthy()
    expect(transaction.getStatus()).toBe(TransactionStatus.PENDING)
    expect(transaction.getUpdatedAt().diff(updatedAt).milliseconds).toBeGreaterThan(0)
  })

  test('should do nothing at start processing payment', async ({ expect }) => {
    const transaction = Transaction.restore(
      crypto.randomUUID(),
      crypto.randomUUID(),
      'Client',
      'client@adonis.com',
      new Big(200),
      [
        {
          productId: crypto.randomUUID(),
          quantity: 2,
        },
      ],
      '',
      '',
      TransactionStatus.PENDING,
      '5569000000006063',
      '010',
      DateTime.local(),
      DateTime.local()
    )
    await setTimeout(50)
    const output = transaction.startProcessingPayment()
    expect(output).toBeFalsy()
  })

  test('should fail to start processing payment')
    .with([
      {
        id: crypto.randomUUID(),
        clientId: crypto.randomUUID(),
        clientName: 'Client',
        clientEmail: 'client@adonis.com',
        amount: new Big(200),
        products: [
          {
            productId: crypto.randomUUID(),
            quantity: 2,
          },
        ],
        gatewayId: crypto.randomUUID(),
        externalId: crypto.randomUUID(),
        status: TransactionStatus.APPROVED,
        cardNumbers: '5569000000006063',
        cardCvv: '010',
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        id: crypto.randomUUID(),
        clientId: crypto.randomUUID(),
        clientName: 'Client',
        clientEmail: 'client@adonis.com',
        amount: new Big(200),
        products: [
          {
            productId: crypto.randomUUID(),
            quantity: 2,
          },
        ],
        gatewayId: crypto.randomUUID(),
        externalId: crypto.randomUUID(),
        status: TransactionStatus.REFUNDED,
        cardNumbers: '5569000000006063',
        cardCvv: '010',
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
    ])
    .run(async ({ expect }, transactionData) => {
      const transaction = Transaction.restore(
        transactionData.id,
        transactionData.clientId,
        transactionData.clientName,
        transactionData.clientEmail,
        transactionData.amount,
        transactionData.products,
        transactionData.gatewayId,
        transactionData.externalId,
        transactionData.status,
        transactionData.cardNumbers,
        transactionData.cardCvv,
        transactionData.createdAt,
        transactionData.updatedAt
      )
      expect(() => transaction.startProcessingPayment()).toThrowError(
        'Transaction must be in "CREATED" status to start processing payment'
      )
    })

  test('should finish processing payment', async ({ expect }) => {
    const transaction = Transaction.restore(
      crypto.randomUUID(),
      crypto.randomUUID(),
      'Client',
      'client@adonis.com',
      new Big(200),
      [
        {
          productId: crypto.randomUUID(),
          quantity: 2,
        },
      ],
      '',
      '',
      TransactionStatus.PENDING,
      '556900000006063',
      '010',
      DateTime.local(),
      DateTime.local()
    )
    const input = {
      gatewayId: crypto.randomUUID(),
      externalId: crypto.randomUUID(),
    }
    const updatedAt = transaction.getUpdatedAt()
    await setTimeout(50)
    const output = transaction.finishProcessingPayment(input.gatewayId, input.externalId)
    expect(output).toBeTruthy()
    expect(transaction.getStatus()).toBe(TransactionStatus.APPROVED)
    expect(transaction.getGatewayId()).toBe(input.gatewayId)
    expect(transaction.getExternalId()).toBe(input.externalId)
    expect(transaction.getUpdatedAt().diff(updatedAt).milliseconds).toBeGreaterThan(0)
  })

  test('should do nothing at finish processing payment', async ({ expect }) => {
    const transaction = Transaction.restore(
      crypto.randomUUID(),
      crypto.randomUUID(),
      'Client',
      'client@adonis.com',
      new Big(200),
      [
        {
          productId: crypto.randomUUID(),
          quantity: 2,
        },
      ],
      crypto.randomUUID(),
      crypto.randomUUID(),
      TransactionStatus.APPROVED,
      '5569000000006063',
      '010',
      DateTime.local(),
      DateTime.local()
    )
    const input = {
      gatewayId: crypto.randomUUID(),
      externalId: crypto.randomUUID(),
    }
    await setTimeout(50)
    const output = transaction.finishProcessingPayment(input.gatewayId, input.externalId)
    expect(output).toBeFalsy()
  })

  test('should fail to finish processing payment')
    .with([
      {
        id: crypto.randomUUID(),
        clientId: crypto.randomUUID(),
        clientName: 'Client',
        clientEmail: 'client@adonis.com',
        amount: new Big(200),
        products: [
          {
            productId: crypto.randomUUID(),
            quantity: 2,
          },
        ],
        gatewayId: '',
        externalId: '',
        status: TransactionStatus.CREATED,
        cardNumbers: '5569000000006063',
        cardCvv: '010',
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        id: crypto.randomUUID(),
        clientId: crypto.randomUUID(),
        clientName: 'Client',
        clientEmail: 'client@adonis.com',
        amount: new Big(200),
        products: [
          {
            productId: crypto.randomUUID(),
            quantity: 2,
          },
        ],
        gatewayId: crypto.randomUUID(),
        externalId: crypto.randomUUID(),
        status: TransactionStatus.REFUNDED,
        cardNumbers: '5569000000006063',
        cardCvv: '010',
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
    ])
    .run(async ({ expect }, transactionData) => {
      const transaction = Transaction.restore(
        transactionData.id,
        transactionData.clientId,
        transactionData.clientName,
        transactionData.clientEmail,
        transactionData.amount,
        transactionData.products,
        transactionData.gatewayId,
        transactionData.externalId,
        transactionData.status,
        transactionData.cardNumbers,
        transactionData.cardCvv,
        transactionData.createdAt,
        transactionData.updatedAt
      )
      expect(() =>
        transaction.finishProcessingPayment(crypto.randomUUID(), crypto.randomUUID())
      ).toThrowError('Transaction must be in "PENDING" status to finish processing payment')
    })

  test('should reimburse payment', async ({ expect }) => {
    const transaction = Transaction.restore(
      crypto.randomUUID(),
      crypto.randomUUID(),
      'Client',
      'client@adonis.com',
      new Big(200),
      [
        {
          productId: crypto.randomUUID(),
          quantity: 2,
        },
      ],
      crypto.randomUUID(),
      crypto.randomUUID(),
      TransactionStatus.APPROVED,
      '556900000006063',
      '010',
      DateTime.local(),
      DateTime.local()
    )
    const updatedAt = transaction.getUpdatedAt()
    await setTimeout(50)
    const output = transaction.reimbursePayment()
    expect(output).toBeTruthy()
    expect(transaction.getStatus()).toBe(TransactionStatus.REFUNDED)
    expect(transaction.getUpdatedAt().diff(updatedAt).milliseconds).toBeGreaterThan(0)
  })

  test('should do nothing at reimburse payment', async ({ expect }) => {
    const transaction = Transaction.restore(
      crypto.randomUUID(),
      crypto.randomUUID(),
      'Client',
      'client@adonis.com',
      new Big(200),
      [
        {
          productId: crypto.randomUUID(),
          quantity: 2,
        },
      ],
      crypto.randomUUID(),
      crypto.randomUUID(),
      TransactionStatus.REFUNDED,
      '556900000006063',
      '010',
      DateTime.local(),
      DateTime.local()
    )
    await setTimeout(50)
    const output = transaction.reimbursePayment()
    expect(output).toBeFalsy()
  })

  test('should fail to reimburse payment')
    .with([
      {
        id: crypto.randomUUID(),
        clientId: crypto.randomUUID(),
        clientName: 'Client',
        clientEmail: 'client@adonis.com',
        amount: new Big(200),
        products: [
          {
            productId: crypto.randomUUID(),
            quantity: 2,
          },
        ],
        gatewayId: '',
        externalId: '',
        status: TransactionStatus.CREATED,
        cardNumbers: '5569000000006063',
        cardCvv: '010',
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        id: crypto.randomUUID(),
        clientId: crypto.randomUUID(),
        clientName: 'Client',
        clientEmail: 'client@adonis.com',
        amount: new Big(200),
        products: [
          {
            productId: crypto.randomUUID(),
            quantity: 2,
          },
        ],
        gatewayId: '',
        externalId: '',
        status: TransactionStatus.PENDING,
        cardNumbers: '5569000000006063',
        cardCvv: '010',
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
    ])
    .run(async ({ expect }, transactionData) => {
      const transaction = Transaction.restore(
        transactionData.id,
        transactionData.clientId,
        transactionData.clientName,
        transactionData.clientEmail,
        transactionData.amount,
        transactionData.products,
        transactionData.gatewayId,
        transactionData.externalId,
        transactionData.status,
        transactionData.cardNumbers,
        transactionData.cardCvv,
        transactionData.createdAt,
        transactionData.updatedAt
      )
      expect(() => transaction.reimbursePayment()).toThrowError(
        'Transaction must be in "APPROVED" status to reimburse payment'
      )
    })
})
