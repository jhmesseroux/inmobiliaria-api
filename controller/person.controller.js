const { all, paginate, create, findOne, update, destroy } = require('../generic/factoryControllers')
const Person = require('../schemas/person')

exports.GetAll = all(Person)
exports.Paginate = paginate(Person)
exports.Create = create(Person)
exports.GetById = findOne(Person)
exports.Put = update(Person)
exports.Destroy = destroy(Person)
