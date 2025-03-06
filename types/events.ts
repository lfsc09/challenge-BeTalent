declare module '@adonisjs/core/types' {
  interface EventsList {
    'purchase:created': PurchaseCreatedEvent
    'payment:failed': PurchaseCreatedEvent
  }
}

export type PurchaseCreatedEvent = {
  transactionId: string
  retryCount: number
}
