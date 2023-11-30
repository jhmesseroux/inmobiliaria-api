const router = require('express').Router()
const ctrl = require('../controller/jobs.controller')

//Create
router.post('/expiring-contracts', ctrl.noticeExpiringContracts)
router.post('/debts', ctrl.noticeDebts)
router.post('/receipt-current-month', ctrl.NoticeReceiptCurrentMonth)

router.get('/', ctrl.GetAll)
router.get('/paginate', ctrl.Paginate)

module.exports = router
