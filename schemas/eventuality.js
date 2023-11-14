/* eslint-disable space-before-function-paren */
const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')
const Contract = require('./contract')
const Property = require('./property')

const Eventuality = dbConnect.define(
  'Eventuality',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    PropertyId: {
      allowNull: true,
      type: DataTypes.BIGINT,
      defaultValue: null,
      validate: {
        validateIfExisteContractId(value) {
          if (this.getDataValue('ContractId') && value) {
            throw new Error('La eventualidad debe pertenecer a un contrato o a una propiedad.')
          }
          if (!this.getDataValue('ContractId') && !value) {
            throw new Error('La eventualidad debe pertenecer a un contrato o a una propiedad.')
          }
        },
      },
    },
    paymentId: DataTypes.BIGINT,
    ContractId: {
      allowNull: true,
      type: DataTypes.BIGINT,
      validate: {
        validateIfExisteContractId(value) {
          if (this.getDataValue('PropertyId') && value) {
            throw new Error('La eventualidad debe pertenecer a un contrato o a una propiedad.')
          }
          if (!this.getDataValue('PropertyId') && !value) {
            throw new Error('La eventualidad debe pertenecer a un contrato o a una propiedad.')
          }
        },
      },
    },
    clientAmount: {
      allowNull: false,
      type: DataTypes.FLOAT,
      validate: {
        notNull: {
          msg: 'El monto del cliente es obligatorio.',
        },
        notEmpty: {
          msg: 'El monto del cliente es obligatorio.',
        },
      },
    },
    ownerAmount: {
      allowNull: false,
      type: DataTypes.FLOAT,
      validate: {
        notNull: {
          msg: 'El monto del dueño es obligatorio.',
        },
        notEmpty: {
          msg: 'El monto del dueño es obligatorio.',
        },
      },
    },
    clientPaid: DataTypes.DATE,
    ownerPaid: DataTypes.DATE,
    isReverted: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING(100),
      validate: {
        notNull: {
          msg: 'El titulo es obligatorio.',
        },
        notEmpty: {
          msg: 'El titulo es obligatorio.',
        },
      },
    },
    description: DataTypes.STRING,
    expiredDate: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      validate: {
        notNull: {
          msg: 'La fecha de vencimiento es obligatoria.',
        },
        notEmpty: {
          msg: 'La fecha de vencimiento es obligatoria.',
        },
      },
    },
  },
  {
    tableName: 'eventualities',
  }
)

Eventuality.belongsTo(Organization, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Organization.hasMany(Eventuality)

Eventuality.belongsTo(Property)
Property.hasMany(Eventuality)

Eventuality.belongsTo(Contract)
Contract.hasMany(Eventuality)

module.exports = Eventuality
