const Organization = require('../schemas/organization')
const {
  all,
  paginate,
  create,
  findOne,
  update,
  destroy,
} = require('../Generic/factoryControllers')
const { catchAsync } = require('../helpers/catchAsync')
const jwt = require('jsonwebtoken')
const Account = require('../schemas/account')
const { dbConnect } = require('../db')
const AppError = require('../helpers/AppError')

exports.GetAll = all(Organization)
exports.Paginate = paginate(Organization)
exports.Create = create(Organization, ['name'])
exports.GetById = findOne(Organization)
exports.Put = update(Organization, ['name'])
exports.Destroy = destroy(Organization)


