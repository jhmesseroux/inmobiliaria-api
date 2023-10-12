const jwt = require('jsonwebtoken')
const { catchAsync } = require('./catchAsync')
const { promisify } = require('util')
const AppError = require('./AppError')
const Account = require('../schemas/account')

exports.protect = catchAsync(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(
      new AppError(
        'No ha iniciado sesión, por favor inicie sesión para obtener acceso!',
        401
      )
    )
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_KEY_TOKEN
  )
  const currentUser = await Account.findByPk(decoded.id)

  if (!currentUser) {
    return next(new AppError('El usuario ya no existe', 401))
  }

  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'Este usuario cambió recientemente su contraseña. Inicie sesión de nuevo',
        401
      )
    )
  }

  req.user = currentUser
  next()
})
