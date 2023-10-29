const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')

const Parameter = dbConnect.define(
  'Parameter',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true
    },
    key: {
      type: DataTypes.STRING(20),
      allowNull: false,
      set(value) {
        this.setDataValue('key', value.trim().replace(/ /g, '_').toLowerCase())
      },
      unique: {
        name: 'key_organization_id_parameter_unique',
        msg: 'Ya existe un registro con esa clave.'
      },
      validate: {
        notNull: {
          msg: 'La clave del parametro no puede ser nula.'
        },
        notEmpty: {
          msg: 'La clave del parametro no puede ser vacia.'
        },
        len: {
          args: [3, 20],
          msg: 'La clave del parametro debe tener entre 3 y 20 caracteres.'
        }
      }
    },
    value: {
      type: DataTypes.STRING(50),
      allowNull: false,
      set(value) {
        this.setDataValue('value', value.trim())
      },
      validate: {
        notNull: {
          msg: 'El valor del parametro no puede ser nulo.'
        },
        notEmpty: {
          msg: 'El valor del parametro no puede ser vacio.'
        }
      }
    },
    OrganizationId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      unique: {
        name: 'key_organization_id_parameter_unique',
        msg: 'Ya existe un registro con esa clave.'
      },
      validate: {
        notNull: {
          msg: 'La organización es obligatoria.'
        },
        notEmpty: {
          msg: 'La organización es obligatoria.'
        }
      }
    },
    description: DataTypes.STRING(100)
  },
  {
    tableName: 'parameters'
  }
)

Parameter.belongsTo(Organization, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE'
})
Organization.hasMany(Parameter)

module.exports = Parameter
