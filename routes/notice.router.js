const router = require('express').Router()
const ctrl = require('../controller/jobs.controller')

//Create
router.post('/expiring-contracts', ctrl.noticeExpiringContracts)
router.post('/debts', ctrl.noticeDebts)
router.post('/receipt-current-month', ctrl.NoticeReceiptCurrentMonth)

module.exports = router
