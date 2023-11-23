const router = require('express').Router()
const ctrl = require('../controller/debt.controller')
// const jc = require('../controller/jobs.controller')
const auth = require('../controller/authController')

router.use(auth.protect)
router.post('/', ctrl.Post)
router.post('/job/monthly/clients', ctrl.jobDebtsClients)
router.post('/job/monthly/owners', ctrl.jobDebtsOwners)

router.get('/', ctrl.GetAll)
router.get('/paginate', ctrl.Paginate)
router.get('/logs/paginate', ctrl.Logs)
router.get('/:id', ctrl.GetById)

router.put('/:id', ctrl.Put)
router.delete('/:id', ctrl.Destroy)

module.exports = router
