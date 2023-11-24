const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')
const Contract = require('./contract')
const Person = require('./person')

const DebtLog = dbConnect.define(
  'DebtLog',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El título es obligatorio.',
        },
        notEmpty: {
          msg: 'El título es obligatorio.',
        },
        len: {
          args: [1, 255],
          msg: 'El título debe tener entre 1 y 255 caracteres.',
        },
      },
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: {
          args: [['SUCCESS', 'FAIL']],
          msg: 'El estado debe ser SUCCESS o FAIL.',
        },
      },
    },
    OrganizationId: DataTypes.BIGINT,
    ContractId: DataTypes.BIGINT,
    PersonId: DataTypes.BIGINT,
  },
  {
    tableName: 'debtlogs',
    paranoid: true,
  }
)

DebtLog.belongsTo(Organization)
Organization.hasMany(DebtLog)

DebtLog.belongsTo(Contract)
Contract.hasMany(DebtLog)

DebtLog.belongsTo(Person)
Person.hasMany(DebtLog)

module.exports = DebtLog
