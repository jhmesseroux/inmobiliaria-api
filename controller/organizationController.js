const Organization = require('../schemas/organization')
const { all, paginate, create, findOne, update, destroy } = require('../generic/factoryControllers')
const { catchAsync } = require('../helpers/catchAsync')
const jwt = require('jsonwebtoken')
const Account = require('../schemas/account')
const { dbConnect } = require('../db')
const AppError = require('../helpers/AppError')
const Plan = require('../schemas/plan')

const include = {
  include: [
    {
      model: Plan,
    },
  ],
}

exports.GetAll = all(Organization, include)
exports.Paginate = paginate(Organization, include)
exports.Create = create(Organization, ['name'])
exports.GetById = findOne(Organization, include)
exports.Put = update(Organization, ['name'])
exports.Destroy = destroy(Organization)
