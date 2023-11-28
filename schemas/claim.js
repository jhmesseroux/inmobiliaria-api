const { dbConnect } = require('../db')
const { DataTypes } = require('sequelize')
const Property = require('./property')
const Organization = require('./organization')

const Claim = dbConnect.define(
  'Claim',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    PropertyId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      validate: {
        notNull: {
          msg: 'La propiedad es obligatoria.',
        },
        notEmpty: {
          msg: 'La propiedad es obligatoria.',
        },
      },
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING(10),
      defaultValue: 'Abierto',
      validate: {
        isIn: [['Abierto', 'Cerrado']],
      },
    },
    details: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      get: function () {
        if (!this.getDataValue('details')) return []
        return JSON.parse(this.getDataValue('details'))
      },
      set: function (value) {
        return this.setDataValue('details', JSON.stringify(value))
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La descripción no puede ser nulo.',
        },
        notEmpty: {
          msg: 'La descripción no puede ser nulo.',
        },
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'claims',
  }
)

Claim.belongsTo(Organization, { foreignKey: { allowNull: false } })
Organization.hasMany(Claim)

Claim.belongsTo(Property, { foreignKey: { allowNull: false } })
Property.hasMany(Claim)

module.exports = Claim
