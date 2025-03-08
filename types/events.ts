declare module '@adonisjs/core/types' {
  interface EventsList {
    'purchase:created': PurchaseCreatedEvent
    'payment:failed': PurchaseCreatedEvent
    'purchase:reimburse': PurchaseReimburseEvent
    'reimbursement:failed': PurchaseReimburseEvent
  }
}

export type PurchaseCreatedEvent = {
  transactionId: string
  retryCount: number
}

export type PurchaseReimburseEvent = {
  transactionId: string
  retryCount: number
}
