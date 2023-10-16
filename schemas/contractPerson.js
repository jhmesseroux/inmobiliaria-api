const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')

const ContractPerson = dbConnect.define(
  'ContractPerson',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true
    },
    role: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El rol no puede ser nulo.'
        },
        notEmpty: {
          msg: 'El rol no puede ser vacio.'
        },
        isIn: {
          args: [['INQUILINO', 'GARANTE']],
          msg: 'El rol debe ser INQUILINO o GARANTE.'
        },
        len: {
          args: [1, 10],
          msg: 'El rol debe tener entre 1 y 10 caracteres.'
        }
      }
    }
  },
  {
    tableName: 'contractpersons'
  }
)

module.exports = ContractPerson
