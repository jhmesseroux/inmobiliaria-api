const router = require('express').Router()
const ctrl = require('../controller/contract.controller')
const auth = require('../controller/authController')

router.use(auth.protect)
router.post('/', ctrl.Post)
router.post('/:id/add-garantes', ctrl.AddGarantes)
router.post('/job/sendReceiptMpnthly', ctrl.SendReceiptCurrentMonth)

router.get('/', ctrl.GetAll)
router.get('/paginate', ctrl.Paginate)
router.get('/:id', ctrl.GetById)
router.get('/owner/:id/all', ctrl.GetOwnerContracts)

router.put('/:id', ctrl.Put)
router.put('/:id/finish', ctrl.finish)
router.put('/:id/add-price', ctrl.AddPrice)

router.delete('/:id', ctrl.Destroy)
// router.get('/expired-contracts/:days', ctrl.ExpiredContracts)

router.get('/debts/client/all', ctrl.DebtsClients)
router.get('/debts/owner/all', ctrl.DebtsOwners)

module.exports = router
