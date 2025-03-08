import emitter from '@adonisjs/core/services/emitter'

const ProcessPayment = () => import('#services/usecase/purchase/process_payment')
const ProcessReimbursement = () => import('#services/usecase/purchase/process_reimbursement')

emitter.on('purchase:created', [ProcessPayment, 'eventExecute'])
emitter.on('payment:failed', [ProcessPayment, 'eventExecute'])
emitter.on('purchase:reimburse', [ProcessReimbursement, 'eventExecute'])
emitter.on('reimbursement:failed', [ProcessReimbursement, 'eventExecute'])
