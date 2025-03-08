import Gateway from '#models/gateway'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const uniqueKey = 'name'

    await Gateway.updateOrCreateMany(uniqueKey, [
      {
        name: 'Gateway 1',
        isActive: true,
        priority: 1,
        gatewayModule: 'gateway1',
      },
      {
        name: 'Gateway 2',
        isActive: true,
        priority: 2,
        gatewayModule: 'gateway2',
      },
    ])
  }
}
