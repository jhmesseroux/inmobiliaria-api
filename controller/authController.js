const crypto = require('crypto')
const { promisify } = require('util')
const Account = require('./../schemas/account')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { catchAsync } = require('../helpers/catchAsync')
const AppError = require('../helpers/AppError')
const { dbConnect } = require('../db')
const Organization = require('../schemas/organization')
const Administrador = require('../schemas/administrator')
const Email = require('../helpers/email')

const createToken = (user) => {
  return jwt.sign(user, process.env.SECRET_KEY_TOKEN, {
    expiresIn: process.env.SECRET_TOKEN_KEY_INSPIRE_IN,
  })
}
const createSendToken = async (data, statusCode, res) => {
  data.password = undefined
  // console.log('data :: ',data)
  const token = createToken({ ...data })

  return res.status(statusCode).json({
    status: 'success',
    ok: true,
    code: 200,
    token,
  })
}

exports.SignUp = catchAsync(async (req, res, next) => {
  try {
    const result = await dbConnect.transaction(async (t) => {
      // set a free plan by default
      req.body.PlanId = 1

      const newOrg = await Organization.create(req.body, { transaction: t })
      const account = await Account.create(
        {
          email: req.body.email,
          password: req.body.password,
          username: req.body.email.split('@')[0],
          OrganizationId: newOrg.id,
        },
        { transaction: t }
      )
      const data = {
        username: account.username,
        email: account.email,
        id: account.id,
        role: account.role,
        avatar: account.avatar,
        OrganizationId: account.OrganizationId,
        OrganizationName: newOrg.name,
        OrganizationEmail: newOrg.email,
        OrganizationAvatar: newOrg.avatar,
      }

      // send verifications mail
      // new Email({ ...data, url: `${req.body.url}/verifyAccount/${account.id}` })

      createSendToken(data, 201, res)
    })
  } catch (error) {
    return next(error)
  }
})

exports.SignIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('Proporcione un correo electrónico y una contraseña por favor.', 400))
  }

  const account = await Account.findOne({ where: { email }, include: ['Organization'] })

  if (!account || !(await account.checkPassword(password, account.password))) {
    return next(new AppError('Correo o contraseña incorrectos.', 401))
  }

  // 3) If everything ok, send token to client
  const data = {
    username: account.username,
    email: account.email,
    id: account.id,
    role: account.role,
    avatar: account.avatar,
    OrganizationId: account.OrganizationId,
    OrganizationName: account.Organization.name,
    OrganizationEmail: account.Organization.email,
    OrganizationAvatar: account.Organization.avatar,
  }
  createSendToken(data, 200, res)
})

exports.SignUpAdmin = catchAsync(async (req, res, next) => {
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(req.body.password))
    return next(
      new AppError(
        'La contraseña debe contener al menos 8 y máximo 20 caracteres, incluidos al menos 1 mayúscula, 1 minúscula, un número y un carácter especial.',
        400
      )
    )

  const newUser = await Administrador.create(req.body)
  return res.json({
    status: 201,
    success: 'success',
    ok: true,
    message: 'El administrador fue creado con exito',
    data: newUser,
  })
})

exports.SignInAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('Proporcione un correo electrónico y una contraseña por favor.', 400))
  }

  const admin = await Administrador.findOne({ where: { email } })

  if (!admin || !(await admin.checkPassword(password, admin.password))) {
    return next(new AppError('Correo o contraseña incorrectos.', 401))
  }

  // 3) If everything ok, send token to client
  const data = {
    username: admin.username,
    email: admin.email,
    id: admin.id,
    role: admin.role,
    avatar: admin.avatar,
  }
  createSendToken(data, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('No has iniciado sesión, ¡identifícate para obtener acceso!', 401))
  }

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY_TOKEN)
  const currentUser = await Account.findByPk(decoded.id)

  if (!currentUser) {
    return next(new AppError('El usuario ya no existe', 401))
  }

  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('Este usuario cambió recientemente su contraseña. Inicie sesión de nuevo', 401))
  }

  req.user = currentUser

  next()
})
exports.protectAdmin = catchAsync(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('No has iniciado sesión, ¡identifícate para obtener acceso!', 401))
  }

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY_TOKEN)
  const currentUser = await Administrador.findByPk(decoded.id)

  if (!currentUser) {
    return next(new AppError('El usuario ya no existe', 401))
  }

  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('Este usuario cambió recientemente su contraseña. Inicie sesión de nuevo', 401))
  }

  req.user = currentUser

  next()
})

exports.renewToken = catchAsync(async (req, res, next) => {
  createSendToken(req.user, 200, res)
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new AppError('No tienes permiso para realizar esta acción', 403))
    next()
  }
}

exports.ForgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) return next(new AppError('El correo es requerido.', 404))

  const user = await Account.findOne({ where: { email: req.body.email } })
  if (!user) return next(new AppError('No existe un usuario con este correo electrónico.', 404))

  const resetToken = user.createPasswordResetToken()
  await user.save()

  try {
    // http://vps-1387733-x.dattaweb.com:4000/api/v1
    // https://marani-ferreteria.netlify.app/
    const resetURL = `${req.body.url}/resetPassword/${resetToken}`
    // path for image wuth path
    const imagePath = `${req.protocol}://${req.get('host')}/logomarani.png`

    await new Email({ ...user.dataValues, url: resetURL, imagePath }).sendPasswordReset()
    res.status(200).json({
      status: 'success',
      message: 'Token sent successfully!',
    })
  } catch (err) {
    user.passwordResetToken = null
    user.passwordResetExpires = null
    await user.save()
    return next(new AppError('Hubo un problema al enviar el correo electrónico.', 500))
  }
})

exports.ResetPassword = catchAsync(async (req, res, next) => {
  console.log('hello')
  // Get Uer based on the token
  if (!req.params.token) return next(new AppError('Token inválido o caducado.', 404))
  const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await Account.findOne({
    where: { passwordResetToken: hashToken, passwordResetExpires: { [Op.gt]: Date.now() } },
  })

  if (!user) return next(new AppError('No existe un usuario para este token. Token no válido o caducado.', 404))

  // validate user and token
  user.password = await user.hashPassword(req.body.password)
  // user.password = await (req.body.password);
  user.passwordResetToken = null
  user.passwordResetExpires = null
  await user.save()

  // Log in user again
  createSendToken(user, 200, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get the user
  const user = await Account.findOne({ where: { email: req.user.email } })

  // check password
  if (!user || !(await user.checkPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Contraseña incorrecta', 401))
  }

  // update password
  user.password = await user.hashPassword(req.body.password)
  await user.save()

  createSendToken(user, 200, res)
})

exports.updatePasswordOtherUser = catchAsync(async (req, res, next) => {
  // Get the user
  const user = await Account.findOne({ where: { email: req.body.email } })

  // check password
  if (!user) {
    return next(new AppError('No existe ese usuario.', 401))
  }

  // update password
  user.password = await user.hashPassword(req.body.password)
  await user.save()
  return res.status(200).json({
    status: 'success',
    ok: true,
    code: 200,
    message: 'Contraseña actualizada correctamente.',
  })
})

exports.CheckToken = catchAsync(async (req, res, next) => {
  const token = req.body.token
  if (!token) return next(new AppError('No se ha proporcionado un token.', 401))

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY_TOKEN)

  const account = await Account.findOne({ where: { id: decoded.id }, include: ['Organization'] })

  if (!account) return next(new AppError('El usuario ya no existe.', 401))

  if (account.changePasswordAfter(decoded.iat))
    return next(new AppError('El usuario cambió la contraseña recientemente. Por favor, inicie sesión de nuevo.', 401))

  const data = {
    username: account.username,
    email: account.email,
    id: account.id,
    role: account.role,
    avatar: account.avatar,
    OrganizationId: account.OrganizationId,
    OrganizationName: account.Organization.name,
    OrganizationEmail: account.Organization.email,
    OrganizationAvatar: account.Organization.avatar,
  }
  const newtoken = createToken(data)
  return res.status(200).json({
    status: 'success',
    ok: true,
    code: 200,
    token: newtoken,
  })
})
