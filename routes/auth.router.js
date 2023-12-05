const router = require('express').Router()
const auth = require('../controller/authController')

router.post('/signup', auth.SignUp)
router.post('/signin', auth.SignIn)

router.post('/signin/admin', auth.SignInAdmin)
router.post('/signup/admin', auth.SignUpAdmin)

router.post('/check-token', auth.CheckToken)
router.post('/forgot-password', auth.ForgotPassword)
router.patch('/reset-password/:token', auth.ResetPassword)

module.exports = router
