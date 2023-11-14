const { all, paginate, create, findOne, update, destroy } = require('../generic/factoryControllers')
const Contract = require('../schemas/contract')
const Expense = require('../schemas/expense')
const Property = require('../schemas/property')

exports.GetAll = all(Expense, {
  include: [
    {
      model: Contract,
      attributes: ['id', 'PropertyId'],
      include: { model: Property, attributes: ['floor', 'dept', 'street', 'number'] },
    },
  ],
})
exports.Paginate = paginate(Expense)
exports.Create = create(Expense)
exports.GetById = findOne(Expense)
exports.Put = update(Expense)
exports.Destroy = destroy(Expense)
