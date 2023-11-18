const router = require('express').Router()
const ctrl = require('../controller/expense.controller')

const auth = require('../controller/authController')

router.use(auth.protect)

router.get('/', ctrl.GetAll)
router.post('/', ctrl.Create)
router.get('/paginate', ctrl.Paginate)

router.get('/:id', ctrl.GetById)
router.put('/:id', ctrl.Put)
router.delete('/:id', ctrl.Destroy)

module.exports = router
