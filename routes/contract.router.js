const router = require('express').Router()
const ctrl = require('../controller/contract.controller')
const validador = require('../helpers/validador')

router.use(validador.protect)

router.post('/', ctrl.Post)
router.get('/', ctrl.GetAll)
router.get('/paginate', ctrl.Paginate)
router.put('/:id', ctrl.Put)
router.put('/:id/finish', ctrl.finish)
router.put('/:id/add-price', ctrl.AddPrice)
router.post('/:id/add-garantes', ctrl.AddGarantes)
router.delete('/:id', ctrl.Destroy)
router.get('/:id', ctrl.GetById)

// router.get('/expired-contracts/:days', ctrl.ExpiredContracts)
router.get('/historial/prices', ctrl.HistorialPrice)
router.get('/debts/client/all', ctrl.DebtsClients)
router.get('/debts/owner/all', ctrl.DebtsOwners)
router.get('/owner/:id/all', ctrl.GetOwnerContracts)

module.exports = router
