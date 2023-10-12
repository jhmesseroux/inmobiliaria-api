const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')

const ContractPrice = dbConnect.define(
  'ContractPrice',
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
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El monto es obligatorio',
        },
        notEmpty: {
          msg: 'El monto es obligatorio',
        },
      },
    },
    percent: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El porcentaje de aumento es obligatorio',
        },
        notEmpty: {
          msg: 'El porcentaje de aumento  es obligatorio',
        },
      },
    },
  },
  {
    tableName: 'contractprices',
    indexes: [
      {
        unique: true,
        fields: ["amount", "ContractId",'createdAt'],
        name: "amount_contractid_createdat_unique"
      }      
    ],
  }
)


module.exports = ContractPrice
