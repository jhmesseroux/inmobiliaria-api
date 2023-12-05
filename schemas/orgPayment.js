const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')

const OrgPayment = dbConnect.define(
  'OrgPayment',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
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
          msg: 'La organización es obligatoria.',
        },
        notEmpty: {
          msg: 'La organización es obligatoria.',
        },
      },
    },
  },
  {
    tableName: 'orgpayments',
  }
)

OrgPayment.belongsTo(Organization, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Organization.hasMany(OrgPayment)

module.exports = OrgPayment
