const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')

const Plan = dbConnect.define(
  'Plan',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        name: 'uniquePlanName',
        msg: 'Ya existe un plan con ese nombre.',
      },
      validate: {
        notNull: {
          msg: 'El nombre del plan no puede ser nulo.',
        },
        notEmpty: {
          msg: 'El nombre del plan no puede ser vacio.',
        },
        len: {
          args: [1, 20],
          msg: 'El nombre del plan debe tener entre 1 y 20 caracteres.',
        },
      },
    },
    description: DataTypes.STRING,
  },
  {
    tableName: 'plans',
  }
)

module.exports = Plan
