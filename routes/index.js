var router = require('express').Router()
// const ctrlJobs = require("../controller/jobs.controller");
const VERSION = '/api/v1'
router.use(`${VERSION}/organizations`, require('./organizationRoutes'))
router.use(`${VERSION}/accounts`, require('./accountRoutes'))
router.use(`${VERSION}/zones`, require('./zone.router'))
router.use(`${VERSION}/parameters`, require('./parameter.router'))
router.use(`${VERSION}/paymenttypes`, require('./paymenttype.router'))
router.use(`${VERSION}/propertytypes`, require('./propertyType.router'))
router.use(`${VERSION}/persons`, require('./person.router'))
router.use(`${VERSION}/properties`, require('./property.router'))
router.use(`${VERSION}/auth`, require('./auth.router'))

// router.use(`${VERSION}/contracts', require('./contract.router'))
// router.use(`${VERSION}/eventualities', require('./eventuality.router'))
// router.use(`${VERSION}/price-historial', require('./historyPrice.router'))
// router.use(`${VERSION}/assurances', require('./assurance.router'))
// router.use(`${VERSION}/visits', require('./visit.router'))
// router.use(`${VERSION}/claims', require('./claim.router'))
// router.use(`${VERSION}/budgets', require('./budget.router'))
// router.use(`${VERSION}/client-expenses', require('./clientExpense.router'))
// router.use(`${VERSION}/owner-expenses', require('./ownerExpense.router'))
// router.use(`${VERSION}/payment-clients', require('./paymentClient.router'))
// router.use(`${VERSION}/payment-owners', require('./paymentOwner.router'))
// router.use(`${VERSION}/debt-clients', require('./debtClient.router'))
// router.use(`${VERSION}/debt-owners', require('./debtOwner.router'))

// router.post(`${VERSION}/jobs-debts-clients', ctrlJobs.jobDebtsClients)
// router.post(`${VERSION}/jobs-debts-owners', ctrlJobs.jobDebtsOwner)
// router.use(`${VERSION}/notices', require('./notice.router'))

module.exports = router
