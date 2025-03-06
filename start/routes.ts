/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
const PurchasesController = () => import('#controllers/purchases_controller')
const GatewaysController = () => import('#controllers/gateways_controller')
const ClientsController = () => import('#controllers/clients_controller')

/**
 * USERS
 */
router.get('/users', [UsersController, 'allUsers'])
router.post('/users', [UsersController, 'newUser'])
router.put('/users/:id', [UsersController, 'editUser'])
router.delete('/users/:id', [UsersController, 'deleteUser'])

/**
 * PRODUCTS
 */
router.get('/products', [ProductsController, 'allProducts'])
router.post('/products', [ProductsController, 'newProduct'])
router.put('/products/:id', [ProductsController, 'editProduct'])
router.delete('/products/:id', [ProductsController, 'deleteProduct'])

/**
 * PURCHASES
 */
router.post('/purchase', [PurchasesController, 'newPurchase'])
router.get('/purchases', [PurchasesController, 'allPurchases'])
router.get('/purchases/:id', [PurchasesController, 'purchaseDetails'])

/**
 * GATEWAYS
 */
router.put('/gateways/:id/active', [GatewaysController, 'editActive'])
router.put('/gateways/:id/priority', [GatewaysController, 'editPriority'])

/**
 * CLIENTS
 */
router.get('/clients', [ClientsController, 'allClients'])
router.get('/clients/:id', [ClientsController, 'clientDetails'])
