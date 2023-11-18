const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')
const Person = require('./person')
const Contract = require('./contract')
const PaymentType = require('./paymentType')

const Payment = dbConnect.define(
  'Payment',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    ContractId: {
      allowNull: true,
      type: DataTypes.BIGINT,
      validate: {
        validateIfExisteContractId(value) {
          if (this.getDataValue('PersonId') && value) {
            throw new Error('El pago debe pertenecer a un contrato o a una persona.')
          }
          if (!this.getDataValue('PersonId') && !value) {
            throw new Error('El pago debe pertenecer a un contrato o a una persona.')
          }
        },
      },
    },
    PersonId: {
      allowNull: true,
      type: DataTypes.BIGINT,
      validate: {
        validateIfExisteContractId(value) {
          if (this.getDataValue('ContractId') && value) {
            throw new Error('El pago debe pertenecer a un contrato o a una persona.')
          }
          if (!this.getDataValue('ContractId') && !value) {
            throw new Error('El pago debe pertenecer a un contrato o a una persona.')
          }
        },
      },
    },
    PaymentTypeId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      validate: {
        notNull: {
          msg: 'El formato de pago es obligatorio',
        },
        notEmpty: {
          msg: 'El formato de pago es obligatorio',
        },
      },
    },

    recharge: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El año de pago es obligatorio',
        },
        notEmpty: {
          msg: 'El año de pago es obligatorio',
        },
      },
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El mes de pago es obligatorio',
        },
        notEmpty: {
          msg: 'El mes de pago es obligatorio',
        },
        isIn: {
          args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
          msg: 'El mes de pago debe ser un número entre 1 y 12',
        },
      },
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El total de pago es obligatorio',
        },
        notEmpty: {
          msg: 'El total de pago es obligatorio',
        },
      },
    },
    paidTotal: DataTypes.FLOAT,
    obs: DataTypes.STRING,
    paidCurrentMonth: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    expenseDetails: {
      type: DataTypes.TEXT('long'),
      get: function () {
        if (!this.getDataValue('expenseDetails')) return null
        return JSON.parse(this.getDataValue('expenseDetails'))
      },
      set: function (value) {
        return this.setDataValue('expenseDetails', JSON.stringify(value || ''))
      },
    },

    eventualityDetails: {
      type: DataTypes.TEXT('long'),
      get: function () {
        if (!this.getDataValue('PaymentDetails')) return null
        return JSON.parse(this.getDataValue('PaymentDetails'))
      },
      set: function (value) {
        return this.setDataValue('PaymentDetails', JSON.stringify(value || ''))
      },
    },
  },
  {
    tableName: 'payments',
    // paranoid: true,
  }
)

Payment.belongsTo(Organization, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Organization.hasMany(Payment)

Payment.belongsTo(Person)
Person.hasMany(Payment)

Payment.belongsTo(Contract)
Contract.hasMany(Payment)

Payment.belongsTo(PaymentType)
PaymentType.hasMany(Payment)

module.exports = Payment
