const router = require('express').Router()
// const ctrlJobs = require("../controller/jobs.controller");
const VERSION = '/api/v1'
router.use(`${VERSION}/auth`, require('./auth.router'))

router.use(`${VERSION}/plans`, require('./plan.router'))
router.use(`${VERSION}/plans-items`, require('./planItem.router'))
// router.use(`${VERSION}/administrators`, require('./admin.router'))

router.use(`${VERSION}/organizations`, require('./organizationRoutes'))
router.use(`${VERSION}/accounts`, require('./accountRoutes'))

router.use(`${VERSION}/zones`, require('./zone.router'))
router.use(`${VERSION}/parameters`, require('./parameter.router'))
router.use(`${VERSION}/paymenttypes`, require('./paymenttype.router'))
router.use(`${VERSION}/propertytypes`, require('./propertyType.router'))

router.use(`${VERSION}/persons`, require('./person.router'))
router.use(`${VERSION}/properties`, require('./property.router'))
router.use(`${VERSION}/contracts`, require('./contract.router'))
router.use(`${VERSION}/eventualities`, require('./eventuality.router'))
router.use(`${VERSION}/debts`, require('./debt.router'))
router.use(`${VERSION}/expenses`, require('./expense.router'))
router.use(`${VERSION}/payments`, require('./payment.router'))

router.use(`${VERSION}/visits`, require('./visit.router'))
router.use(`${VERSION}/claims`, require('./claim.router'))
router.use(`${VERSION}/budgets`, require('./budget.router'))

router.use(`${VERSION}/notices`, require('./notice.router'))

module.exports = router
