
const { all, paginate, create, findOne, update, destroy } = require('../generic/factoryControllers')
const Person = require('../schemas/person')
const Property = require('../schemas/property')
const PropertyType = require('../schemas/propertyType')
const Zone = require('../schemas/zone')

const includeObject = {
	include: [
		{ model: Zone, attributes: ['name'] },
		{ model: PropertyType, attributes: ['description'] },
		{ model: Person, attributes: ['fullName', 'phone', 'email'] },
	],
}
const editableFields = ['ZoneId','PropertyTypeId','PersonId','street','number','floor','dept','isFor','description','nroPartWater','nroPartMuni','nroPartAPI','nroPartGas','folderNumber']

exports.GetAll = all(Property, includeObject)
exports.Paginate = paginate(Property,includeObject)
exports.Create = create(Property)
exports.GetById = findOne(Property, )
exports.Put = update(Property, editableFields)
exports.Destroy = destroy(Property)
