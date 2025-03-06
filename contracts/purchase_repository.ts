import Transaction from '../app/entities/transaction.js'

export abstract class PurchaseRepository {
  abstract restoreTransaction(id: string): Promise<Transaction>
  abstract persistTransaction(input: Transaction): Promise<void>
}
