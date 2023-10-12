const { Eventuality, Property } = require("../../models")
const { all, paginate, create, findOne, update, destroy, } = require("../Generic/FactoryGeneric")

exports.GetAll = all(Eventuality, {
	include: [
		{
			model: Property,
			attributes: ["street", "number", "floor", "dept", "id"],
		},
	],
});
exports.Paginate = paginate(Eventuality);
exports.Create = create(Eventuality, ["PropertyId", "amount", "description", "expiredDate", "clientAmount", "ownerAmount",]);
exports.GetById = findOne(Eventuality);
exports.Put = update(Eventuality, ["PropertyId", "amount", "description", "expiredDate", "clientAmount", "ownerAmount",]);
exports.Destroy = destroy(Eventuality);
