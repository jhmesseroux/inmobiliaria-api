const AppError = require('../helpers/AppError')
const { catchAsync } = require('../helpers/catchAsync')
const { all, findOne } = require('../generic/factoryControllers')
const Account = require('../schemas/account')

exports.GetAll = all(Account)
exports.GetById = findOne(Account)

exports.SignUp = catchAsync(async (req, res, next) => {
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(req.body.password))
    return next(
      new AppError(
        'La contraseña debe contener al menos 8 y máximo 20 caracteres, incluidos al menos 1 mayúscula, 1 minúscula, un número y un carácter especial.',
        400
      )
    )

  const newUser = await Account.create(req.body)
  return res.json({
    status: 201,
    success: 'success',
    ok: true,
    message: 'El usuario fue creado con exito',
    data: newUser,
  })
})
