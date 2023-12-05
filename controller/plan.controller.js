const { all, paginate, create, findOne, update, destroy, destroyMultiple, restore } = require('../generic/factoryControllers')
const Plan = require('../schemas/plan')
const PlanItem = require('../schemas/planItem')

const include = {
  include: [
    {
      model: PlanItem,
    },
  ],
}
exports.GetAll = all(Plan, include)
exports.Paginate = paginate(Plan, include)
exports.Create = create(Plan)
exports.GetById = findOne(Plan, include)
exports.Put = update(Plan)
exports.Destroy = destroy(Plan)
exports.DestroyMultiple = destroyMultiple(Plan)
exports.Restore = restore(Plan)
