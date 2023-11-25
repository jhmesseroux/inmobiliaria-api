const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')
const Property = require('./property')

const Visit = dbConnect.define(
  'Visit',
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
      unique: 'name_organization_id_zone_unique',
      validate: {
        notNull: {
          msg: 'La propiedad es obligatoria.',
        },
        notEmpty: {
          msg: 'La propiedad es obligatoria.',
        },
      },
    },
    OrganizationId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      unique: 'name_organization_id_zone_unique',
      validate: {
        notNull: {
          msg: 'La organización es obligatoria.',
        },
        notEmpty: {
          msg: 'La organización es obligatoria.',
        },
      },
    },
    date: {
      allowNull: false,
      type: DataTypes.DATE,
      unique: 'name_organization_id_zone_unique',
      validate: {
        notNull: {
          msg: 'Ingresa la fecha de la visita',
        },
        notEmpty: {
          msg: 'Ingresa la fecha de la visita',
        },
      },
    },
    description: DataTypes.STRING,
    participants: {
      allowNull: false,
      type: DataTypes.JSON,
      validate: {
        notNull: {
          msg: 'Hay que ingresar por lo menos un visitor',
        },
        notEmpty: {
          msg: 'Hay que ingresar por lo menos un visitor',
        },
      },
      get: function () {
        if (!this.getDataValue('participants')) return []
        return JSON.parse(this.getDataValue('participants'))
      },
      set: function (value) {
        return this.setDataValue('participants', JSON.stringify(value || ''))
      },
    },
  },
  {
    tableName: 'visits',
  }
)

Visit.belongsTo(Organization, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Organization.hasMany(Visit)

Visit.belongsTo(Property)
Property.hasMany(Visit)

module.exports = Visit
