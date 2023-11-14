const router = require('express').Router()
const ctrl = require('../controller/budget.controller')
const auth = require('../controller/authController')

router.use(auth.protect)

router.get('/', ctrl.GetAll)
//Get by id
router.get('/:id', ctrl.GetById)

//Create
router.post('/', ctrl.uploadPhoto, ctrl.Create)

//Update
router.put('/:id', ctrl.uploadPhoto, ctrl.Put)

//Delete
router.delete('/:id', ctrl.Destroy)
module.exports = router
