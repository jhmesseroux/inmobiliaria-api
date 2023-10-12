const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')

const PropertyType = dbConnect.define(
  'PropertyType',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING(50),
      unique: {
        name: 'desc_organization_id_ptyType_unique',
        msg: 'Ya existe una descripción con esas caracteristica.',
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La descripción no puede ser nula.',
        },
        notEmpty: {
          msg: 'La descripción no puede ser vacia.'
        },
        len: {
          args: [1, 50],
          msg: 'La descripción debe tener entre 1 y 50 caracteres.'
        }
      }
    },
    OrganizationId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      unique: {
        name: 'desc_organization_id_ptyType_unique',
        msg: 'Ya existe una descripción con esas caracteristicas.',      },
      validate: {
        notNull: {
          msg: 'La organización es obligatoria.',
        },
        notEmpty: {
          msg: 'La organización es obligatoria.',
        },
      },
    },
  },
  {
    tableName: 'propertytypes',
  }
)

PropertyType.belongsTo(Organization, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
})
Organization.hasMany(PropertyType)

module.exports = PropertyType
