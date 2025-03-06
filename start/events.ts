import emitter from '@adonisjs/core/services/emitter'

const ProcessPayment = () => import('#services/usecase/purchase/process_payment')

emitter.on('purchase:created', [ProcessPayment, 'eventExecute'])
emitter.on('payment:failed', [ProcessPayment, 'eventExecute'])
