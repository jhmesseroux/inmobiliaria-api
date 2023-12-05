const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')
const Plan = require('./plan')

const PlanItem = dbConnect.define(
  'PlanItem',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        name: 'uniquePlanItemDescription',
        msg: 'Ya existe una descripcion igual.',
      },
      validate: {
        notNull: {
          msg: 'La decripcion no puede ser nula.',
        },
        notEmpty: {
          msg: 'La decripcion no puede ser vacia.',
        },
        len: {
          args: [1, 100],
          msg: 'La descripcion del item debe tener entre 1 y 100 caracteres.',
        },
      },
    },
    PlanId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      unique: {
        name: 'uniquePlanItemDescription',
        msg: 'Ya existe una descripcion igual.',
      },
      validate: {
        notNull: {
          msg: 'El plan es obligatorio.',
        },
        notEmpty: {
          msg: 'El plan es obligatorio.',
        },
      },
    },
  },
  {
    tableName: 'planitems',
  }
)

PlanItem.belongsTo(Plan, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Plan.hasMany(PlanItem)

module.exports = PlanItem
