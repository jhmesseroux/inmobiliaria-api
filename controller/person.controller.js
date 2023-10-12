
const { all, paginate, create, findOne, update, destroy } = require('../generic/factoryControllers')
const Person = require('../schemas/person')
const Property = require('../schemas/property')
const PropertyType = require('../schemas/propertyType')

exports.GetAll = all(Person, { include: [{ model: Property, include: { model: PropertyType } }] })
exports.Paginate = paginate(Person)
exports.Create = create(Person, )
exports.GetById = findOne(Person)
exports.Put = update(Person)
exports.Destroy = destroy(Person)
