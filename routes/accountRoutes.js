const router = require('express').Router()
const account = require('../controller/accountController')
const auth = require('../controller/authController')


router.use(auth.protect,auth.restrictTo('admin'))
router.post('/', account.SignUp)
router.get('/', account.GetAll)
router.get('/:id', account.GetById)

module.exports = router
