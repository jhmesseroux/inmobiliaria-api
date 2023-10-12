
const { all, paginate, create, findOne, update, destroy } = require('../generic/factoryControllers');
const PropertyType = require('../schemas/propertyType')

exports.GetAll = all(PropertyType);
exports.Paginate = paginate(PropertyType);
exports.Create = create(PropertyType);
exports.GetById = findOne(PropertyType);
exports.Put = update(PropertyType);
exports.Destroy = destroy(PropertyType);