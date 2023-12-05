const router = require('express').Router()
const ctrl = require('../controller/plan.controller')
const auth = require('../controller/authController')

router.use(auth.protectAdmin, auth.restrictTo('superAdmin', 'manager'))

router.get('/', ctrl.GetAll)
router.get('/paginate', ctrl.Paginate)
router.get('/:id', ctrl.GetById)

router.post('/', ctrl.Create)

router.put('/:id', ctrl.Put)
router.put('/:id/restore', ctrl.Restore)

router.delete('/:id', ctrl.Destroy)
router.delete('/delete/multiple', ctrl.DestroyMultiple)

module.exports = router
