const router = require('express').Router()
const ctrl = require('../controller/parameter.controller')
const validador = require('../helpers/validador')

router.use(validador.protect)

router.get('/', ctrl.GetAll)
router.get('/:id', ctrl.GetById)
router.post('/', ctrl.Create)
router.put('/:id', ctrl.Put)
router.delete('/:id', ctrl.Destroy)

module.exports = router
