const router = require('express').Router()
const ctrl = require('../controller/payment.controller')

const auth = require('../controller/authController')

router.use(auth.protect)

router.get('/', ctrl.GetAll)
router.get('/paginate', ctrl.Paginate)
router.get('/:id', ctrl.GetById)
router.get('/notpaid/contracts', ctrl.NotPaidCurrentMonthContract)
router.get('/notpaid/owners', ctrl.NotPaidCurrentMonthOwner)

router.post('/', ctrl.Post)

router.delete('/:id', ctrl.Destroy)

module.exports = router
