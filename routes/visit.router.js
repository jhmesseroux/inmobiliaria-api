const router = require('express').Router()
const ctrl = require('../controller/visit.controller')
const auth = require('../controller/authController')

router.use(auth.protect)

router.get('/', ctrl.GetAll)
//Get by id
router.get('/:id', ctrl.GetById)

//Create
router.post('/', ctrl.Create)

//Update
router.put('/:id', ctrl.Put)

//Delete
router.delete('/:id', ctrl.Destroy)
module.exports = router
