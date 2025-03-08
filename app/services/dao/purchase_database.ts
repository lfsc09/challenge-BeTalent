import TransactionModel from '#models/transaction'
import db from '@adonisjs/lucid/services/db'
import { PurchaseDAO, PurchaseDTO, DetailsPurchaseDTO } from '../../../contracts/purchase_dao.js'
import { errors as lucidErrors } from '@adonisjs/lucid'

export class PurchaseDAODatabase implements PurchaseDAO {
  async getAllPurchases(): Promise<PurchaseDTO[]> {
    return (await TransactionModel.all()).map((transaction) => ({
      id: transaction.id,
      status: transaction.status,
      amount: transaction.amount.toString(),
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }))
  }

  async getPurchaseDetails(id: string): Promise<DetailsPurchaseDTO> {
    const transaction = await db
      .from('transactions')
      .where('transactions.id', id)
      .leftJoin('gateways', 'gateways.id', '=', 'transactions.gateway_id')
      .leftJoin('clients', 'clients.id', '=', 'transactions.client_id')
      .select(
        'transactions.id',
        'clients.name as clientName',
        'clients.email as clientEmail',
        'gateways.name as gatewayName',
        'transactions.external_id',
        'transactions.status',
        'transactions.amount',
        'transactions.created_at',
        'transactions.updated_at'
      )
      .firstOrFail()

    const products = await db
      .from('transaction_products')
      .where('transaction_id', id)
      .leftJoin('products', 'products.id', '=', 'transaction_products.product_id')
      .select('transaction_products.quantity', 'products.name')

    if (products.length === 0) throw new lucidErrors.E_ROW_NOT_FOUND()

    return {
      id: transaction.id,
      clientName: transaction.clientName,
      clientEmail: transaction.clientEmail,
      gatewayName: transaction.gatewayName,
      externalId: transaction.external_id,
      status: transaction.status,
      amount: transaction.amount.toString(),
      products: products.map((product) => ({
        name: product.name,
        quantity: product.quantity,
      })),
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
    }
  }

  async checkExistence(id: string): Promise<string> {
    return (await TransactionModel.findOrFail(id)).id
  }
}
