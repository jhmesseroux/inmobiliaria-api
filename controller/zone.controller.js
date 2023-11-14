const { all, paginate, create, findOne, update, destroy, destroyMultiple, restore } = require('../generic/factoryControllers')
const Zone = require('../schemas/zone')

exports.GetAll = all(Zone)
exports.Paginate = paginate(Zone)
exports.Create = create(Zone)
exports.GetById = findOne(Zone)
exports.Put = update(Zone)
exports.Destroy = destroy(Zone)
exports.DestroyMultiple = destroyMultiple(Zone)
exports.Restore = restore(Zone)
