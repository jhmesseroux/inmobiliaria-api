const AppError = require('../helpers/AppError')
const { catchAsync } = require('../helpers/catchAsync')
const { all } = require('../generic/factoryControllers')
const Administrador = require('../schemas/administrator')

exports.GetAll = all(Administrador)
