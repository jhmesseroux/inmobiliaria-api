const router = require('express').Router()
const admin = require('../controller/admin.controller')
const auth = require('../controller/authController')

router.post('/sign-in', auth.SignInAdmin)

// router.use(auth.protect,auth.restrictTo('admin'))
router.post('/sign-up', auth.SignUpAdmin)

module.exports = router
