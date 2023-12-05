const router = require('express').Router()
const ctrl = require('../controller/organizationController')
const auth = require('../controller/authController')
// const validador = require('../helpers/validador')

// router.post('/signin', ctrl.SignIn)
// router.post('/check-token', ctrl.checkToken)
// router.post('/forgot-password', ctrl.forgotPassword)
// router.patch('/reset-password/:token', ctrl.resetPassword)

router.use(auth.protect, auth.restrictTo('admin'))

router.get('/', ctrl.GetAll)
router.get('/:id', ctrl.GetById)

// router.post('/', ctrl.SignUp);

router.delete('/:id', ctrl.Destroy)

module.exports = router
