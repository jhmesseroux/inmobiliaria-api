const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')

const Zone = dbConnect.define(
  'Zone',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        name: 'name_organization_id_zone_unique',
        msg: 'Ya existe otra zona con ese nombre.'
      },
      validate: {
        notNull: {
          msg: 'La zona no puede ser nulo.'
        },
        notEmpty: {
          msg: 'La zona no puede ser vacio.'
        },
        len: {
          args: [1, 20],
          msg: 'La zona debe tener entre 1 y 20 caracteres.'
        }
      }
    },
    OrganizationId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      // unique: {
      //   name: 'name_organization_id_zone_unique',
      //   msg: 'Ya existe otra zona con ese nombre.'
      // },
      unique: 'name_organization_id_zone_unique',
      validate: {
        notNull: {
          msg: 'La organización es obligatoria.'
        },
        notEmpty: {
          msg: 'La organización es obligatoria.'
        }
      }
    }
  },
  {
    tableName: 'zones'
  }
)

Zone.belongsTo(Organization, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Organization.hasMany(Zone)

module.exports = Zone
