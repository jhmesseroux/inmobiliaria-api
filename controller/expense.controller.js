const { all, paginate, create, findOne, update, destroy } = require('../generic/factoryControllers')
const Contract = require('../schemas/contract')
const ContractPerson = require('../schemas/contractPerson')
const Expense = require('../schemas/expense')
const Person = require('../schemas/person')
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
exports.Paginate = paginate(Expense, {
  include: [
    {
      model: Contract,
      attributes: ['id', 'PropertyId'],
      include: [
        { model: Property, attributes: ['floor', 'dept', 'street', 'number'] },
        { model: ContractPerson, attributes: ['role'], include: { model: Person, attributes: ['fullName', 'docType', 'docNumber', 'id'] } },
      ],
    },
  ],
})
exports.Create = create(Expense)
exports.GetById = findOne(Expense)
exports.Put = update(Expense)
exports.Destroy = destroy(Expense)
