const router = require('express').Router()
const ctrl = require('../controller/budget.controller')
const auth = require('../controller/authController')

router.use(auth.protect)

router.get('/', ctrl.GetAll)
router.get('/paginate', ctrl.Paginate)
router.get('/:id', ctrl.GetById)

router.post('/', ctrl.uploadPhoto, ctrl.Create)

router.put('/:id', ctrl.uploadPhoto, ctrl.Put)

router.delete('/:id', ctrl.Destroy)

module.exports = router
