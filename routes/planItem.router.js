const router = require('express').Router()
const ctrl = require('../controller/planItem.controller')
const auth = require('../controller/authController')

router.use(auth.protectAdmin, auth.restrictTo('superAdmin', 'manager'))

router.get('/', ctrl.GetAll)
router.get('/paginate', ctrl.Paginate)
router.get('/:id', ctrl.GetById)

router.post('/', ctrl.Create)

router.put('/:id', ctrl.Put)

router.delete('/:id', ctrl.Destroy)

module.exports = router
