const { all, paginate, create, findOne, update, destroy } = require('../generic/factoryControllers')
const Claim = require('../schemas/claim')
const Property = require('../schemas/property')

exports.GetAll = all(Claim, { include: [{ model: Property, attributes: ['id', 'street', 'number', 'dept', 'floor'] }] })
exports.Paginate = paginate(Claim, { include: [{ model: Property, attributes: ['id', 'street', 'number', 'dept', 'floor'] }] })
exports.Create = create(Claim)
exports.GetById = findOne(Claim)
exports.Put = update(Claim, ['details', 'state', 'description'])
exports.Destroy = destroy(Claim)
