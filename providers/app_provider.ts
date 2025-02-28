import type { ApplicationService } from '@adonisjs/core/types'
import { UserDAO } from '../contracts/user_dao.js'

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
    const { UserDAODatabase } = await import('#services/dao/user/user_database')
    this.app.container.bind(UserDAO, () => this.app.container.make(UserDAODatabase))
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
