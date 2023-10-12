const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')

const PaymentType = dbConnect.define(
  'PaymentType',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: {
        name: 'name_organization_id_pmtType_unique',
        msg: 'Ya existe un tipo de pago con ese nombre.',
      },
      validate: {
        notNull: {
          msg: 'El nombre del tipo de pago es obligatorio',
        },
        notEmpty: {
          msg: 'El nombre del tipo de pago es obligatorio',
        },
        len: {
          args: [1, 25],
          msg: 'El nombre del tipo de pago debe tener entre 1 y 25 caracteres',
        }
      },
    },
    OrganizationId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      unique: {
        name: 'name_organization_id_pmtType_unique',
        msg: 'Ya existe un tipo de pago con ese nombre.',      },
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
    tableName: 'paymenttypes',
  }
)

PaymentType.belongsTo(Organization, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
})
Organization.hasMany(PaymentType)

module.exports = PaymentType
