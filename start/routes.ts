/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
const PurchasesController = () => import('#controllers/purchases_controller')
const GatewaysController = () => import('#controllers/gateways_controller')
const ClientsController = () => import('#controllers/clients_controller')

/**
 * LOGIN
 */
router.post('/login', [UsersController, 'login'])

/**
 * USERS
 */
router
  .group(() => {
    router.get('', [UsersController, 'allUsers'])
    router.post('', [UsersController, 'newUser'])
    router.put(':id', [UsersController, 'editUser'])
    router.delete(':id', [UsersController, 'deleteUser'])
  })
  .prefix('/users')
  .use(middleware.auth())

/**
 * PRODUCTS
 */
router
  .group(() => {
    router.get('', [ProductsController, 'allProducts'])
    router.post('', [ProductsController, 'newProduct'])
    router.put(':id', [ProductsController, 'editProduct'])
    router.delete(':id', [ProductsController, 'deleteProduct'])
  })
  .prefix('/products')
  .use(middleware.auth())

/**
 * PURCHASES
 */
router.post('/purchase', [PurchasesController, 'newPurchase'])

router
  .group(() => {
    router.get('', [PurchasesController, 'allPurchases'])
    router.get('/:id', [PurchasesController, 'purchaseDetails'])
  })
  .prefix('/purchases')
  .use(middleware.auth())

router.post('/reimburse/:id', [PurchasesController, 'reimburse']).use(middleware.auth())

/**
 * GATEWAYS
 */
router
  .group(() => {
    router.put(':id/active', [GatewaysController, 'editActive'])
    router.put(':id/priority', [GatewaysController, 'editPriority'])
  })
  .prefix('/gateways')
  .use(middleware.auth())

/**
 * CLIENTS
 */
router
  .group(() => {
    router.get('', [ClientsController, 'allClients'])
    router.get(':id', [ClientsController, 'clientDetails'])
  })
  .prefix('/clients')
  .use(middleware.auth())
