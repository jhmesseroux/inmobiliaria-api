const router = require('express').Router()
const ctrl = require('../controller/debt.controller')
// const jc = require('../controller/jobs.controller')
const auth = require('../controller/authController')

router.use(auth.protect)

router.get('/', ctrl.GetAll)
router.post('/', ctrl.Post)

router.get('/:id', ctrl.GetById)
router.put('/:id', ctrl.Put)
router.delete('/:id', ctrl.Destroy)
router.get('/paginate', ctrl.Paginate)

// router.post('/job/monthly', jc.jobDebtsClients)

module.exports = router
