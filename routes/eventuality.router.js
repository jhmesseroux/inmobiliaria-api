const router = require('express').Router()
const ctrl = require('../controller/eventuality.controller')
const auth = require('../controller/authController')

router.use(auth.protect)

router.get('/', ctrl.GetAll)
router.post('/', ctrl.Create)
router.get('/paginate', ctrl.Paginate)

router.put('/:id', ctrl.Put)
router.get('/:id', ctrl.GetById)
router.delete('/:id', ctrl.Destroy)
router.delete('/delete/multiple', ctrl.DestroyMultiple)

module.exports = router
