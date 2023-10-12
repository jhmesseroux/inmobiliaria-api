const { DataTypes } = require('sequelize')
const { dbConnect } = require('./../db/index')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const User = dbConnect.define(
  'User',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El nombre no puede ser nulo.'
        },
        notEmpty: {
          msg: 'El nombre no puede ser vacio.'
        },
        len: {
          args: [3, 50],
          msg: 'El nombre debe tener entre 3 a 50 caracteres.'
        }
      }
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El apellido no puede ser nulo.'
        },
        notEmpty: {
          msg: 'El apellido no puede ser vacio.'
        },
        len: {
          args: [3, 50],
          msg: 'El nombre debe tener entre 3 a 50 caracteres.'
        }
      }
    },
    cuit: DataTypes.STRING(11),
    telefono: DataTypes.STRING(20),
    domFiscal: DataTypes.STRING(50),
    domEnvio: DataTypes.STRING(50),
    condFiscal: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        isIn: {
          args: [['Res. Inscripto', 'Exento', 'Res. Monotrib', 'Cons. Final']],
          msg: 'Ese tipo de condicion fiscal no está permitido en el sistema.'

        }
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: {
        msg: 'Ya existe otra cuenta con ese correo.'
      },
      validate: {
        isEmail: {
          msg: 'Debe ingresar un correo valido.'
        },
        notNull: {
          msg: 'El correo no puede ser nulo.'
        }
      }
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING(12),
      defaultValue: 'user',
      validate: {
        isIn: {
          args: [['user', 'admin','superAdmin','collaborator']],
          msg: 'Ese rol no está permitido en el sistema.'
        },
        notNull: {
          msg: 'El rol no puede ser nulo.'
        },
        len: {
          args: [4, 12],
          msg: 'El rol debe tener entre 3 a 12 caracteres.'
        }
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: 'La contraseña no puede ser nula.'
        },
        len: {
          args: [3, 255],
          msg: 'La contraseña debe tener entre 3 a 50 caracteres.'
        }
      }
    },
    googleId: DataTypes.STRING,
    passwordChangedAt: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE
  },
  {
    tableName: 'users'
  }
)

User.beforeCreate(async (user, options) => {
  user.password = await bcrypt.hash(user.password, 12)
})

User.prototype.checkPassword = async function (userPassword, hash) {
  return await bcrypt.compare(userPassword, hash)
}
User.prototype.hashPassword = async function (password) {
  return await bcrypt.hash(password, 12)
}

User.prototype.changePasswordAfter = function (jwtIat) {
  if (this.passwordChangedAt) {
    const changePassword = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return jwtIat < changePassword
  }
  return false
}

User.prototype.createPasswordResetToken = function () {
  // create token
  const resetToken = crypto.randomBytes(32).toString('hex')
  // encrypt the token and save to the database
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  // store the time plus 10 mns to the satabase
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000
  // return the token without encrypt
  return resetToken
}

module.exports = User
