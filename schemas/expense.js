const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')
const Contract = require('./contract')

const Expense = dbConnect.define(
  'Expense',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    ContractId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      validate: {
        notNull: {
          msg: 'El contrato es obligatorio',
        },
        notEmpty: {
          msg: 'El contrato es obligatorio',
        },
      },
    },
    description: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La descripción es obligatoria.',
        },
        notEmpty: {
          msg: 'La descripción es obligatoria.',
        },
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El monto es obligatorio',
        },
        notEmpty: {
          msg: 'El monto es obligatorio.',
        },
      },
    },
    isOwner: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'expenses',
  }
)

Expense.belongsTo(Organization, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Organization.hasMany(Expense)

Expense.belongsTo(Contract, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Contract.hasMany(Expense)

module.exports = Expense
