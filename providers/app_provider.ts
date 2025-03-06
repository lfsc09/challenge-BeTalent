import type { ApplicationService } from '@adonisjs/core/types'
import { UserDAO } from '../contracts/user_dao.js'
import { ProductDAO } from '../contracts/product_dao.js'
import { ClientDAO } from '../contracts/client_dao.js'
import { PurchaseRepository } from '../contracts/purchase_repository.js'
import { GatewayDAO } from '../contracts/gateway_dao.js'
import { PaymentFactory } from '../contracts/payment_factory.js'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    const { UserDAODatabase } = await import('#services/dao/user_database')
    this.app.container.bind(UserDAO, () => this.app.container.make(UserDAODatabase))

    const { ProductDAODatabase } = await import('#services/dao/product_database')
    this.app.container.bind(ProductDAO, () => this.app.container.make(ProductDAODatabase))

    const { ClientDAODatabase } = await import('#services/dao/client_database')
    this.app.container.bind(ClientDAO, () => this.app.container.make(ClientDAODatabase))

    const { PurchaseRepositoryDatabase } = await import('#services/repository/purchase_repository')
    this.app.container.bind(PurchaseRepository, () =>
      this.app.container.make(PurchaseRepositoryDatabase)
    )

    const { GatewayDAODatabase } = await import('#services/dao/gateway_database')
    this.app.container.bind(GatewayDAO, () => this.app.container.make(GatewayDAODatabase))

    const { PaymentFactoryImpl } = await import('#services/factory/payment_factory')
    this.app.container.bind(PaymentFactory, () => this.app.container.make(PaymentFactoryImpl))
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
