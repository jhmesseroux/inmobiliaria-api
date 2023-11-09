const router = require('express').Router()
const ctrl = require('../controller/property.controller')
const validador = require('../helpers/validador')

router.use(validador.protect)
router.get('/', ctrl.GetAll)
router.get('/paginate', ctrl.Paginate)
router.get('/:id', ctrl.GetById)
router.post('/', ctrl.Create)
router.put('/:id', ctrl.Put)
router.delete('/:id', ctrl.Destroy)

module.exports = router
