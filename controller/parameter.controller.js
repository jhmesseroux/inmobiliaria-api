const { all, paginate, create, findOne, update, destroy } = require('../generic/factoryControllers')
const Parameter = require('../schemas/parameter')

exports.GetAll = all(Parameter)
exports.Paginate = paginate(Parameter)
exports.Create = create(Parameter)
exports.GetById = findOne(Parameter)
exports.Put = update(Parameter, ['value', 'description'])
exports.Destroy = destroy(Parameter)
