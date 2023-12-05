const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const Administrador = dbConnect.define(
  'Administrador',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El nombre de usuario no puede ser nulo.',
        },
        notEmpty: {
          msg: 'El nombre de usuario no puede ser vacio.',
        },
        len: {
          args: [3, 50],
          msg: 'El nombre de usuario debe tener entre 3 a 50 caracteres.',
        },
      },
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING(12),
      validate: {
        isIn: {
          args: [['superAdmin', 'manager', 'collaborator']],
          msg: 'Ese rol no está permitido en el sistema.',
        },
        notNull: {
          msg: 'El rol no puede ser nulo.',
        },
        len: {
          args: [4, 12],
          msg: 'El rol debe tener entre 3 a 12 caracteres.',
        },
      },
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING(70),
      unique: {
        name: 'email_id_account_unique',
        msg: 'Ya existe otra cuenta con ese correo.',
      },
      validate: {
        isEmail: {
          msg: 'EL correo no es valido.',
        },
        notNull: {
          msg: 'El correo no puede ser nulo.',
        },
        notEmpty: {
          msg: 'El correo no puede ser vacio.',
        },
      },
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: 'La contraseña no puede ser nula.',
        },
        notEmpty: {
          msg: 'La contraseña no puede ser vacia.',
        },
        len: {
          args: [3, 50],
          msg: 'La contraseña debe tener entre 3 a 50 caracteres.',
        },
      },
    },
    avatar: DataTypes.STRING(200),
    passwordChangedAt: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
  },
  {
    tableName: 'administrators',
  }
)

Administrador.beforeCreate(async (user, options) => {
  user.password = await bcrypt.hash(user.password, 12)
})

Administrador.prototype.checkPassword = async function (userPassword, hash) {
  return await bcrypt.compare(userPassword, hash)
}
Administrador.prototype.hashPassword = async function (password) {
  return await bcrypt.hash(password, 12)
}

Administrador.prototype.changePasswordAfter = function (jwtIat) {
  if (this.passwordChangedAt) {
    const changePassword = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return jwtIat < changePassword
  }
  return false
}

Administrador.prototype.createPasswordResetToken = function () {
  // create token
  const resetToken = crypto.randomBytes(32).toString('hex')
  // encrypt the token and save to the database
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  // store the time plus 10 mns to the satabase
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000
  // return the token without encrypt
  return resetToken
}

module.exports = Administrador
