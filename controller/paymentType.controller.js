
const { all, paginate, create, findOne, update, destroy } = require('../generic/factoryControllers');
const PaymentType = require('../schemas/paymentType')

exports.GetAll = all(PaymentType);
exports.Paginate = paginate(PaymentType);
exports.Create = create(PaymentType);
exports.GetById = findOne(PaymentType);
exports.Put = update(PaymentType);
exports.Destroy = destroy(PaymentType);