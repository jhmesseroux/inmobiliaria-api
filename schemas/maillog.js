const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')
const Contract = require('./contract')
const Person = require('./person')

const MailLog = dbConnect.define(
  'MailLog',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    motive: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El motivo es obligatorio.',
        },
        notEmpty: {
          msg: 'El motivo es obligatorio.',
        },
        len: {
          args: [1, 255],
          msg: 'El motivo debe tener entre 1 y 255 caracteres.',
        },
      },
    },
    status: DataTypes.BOOLEAN,
    OrganizationId: DataTypes.BIGINT,
    PersonId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: 'maillogs',
  }
)

MailLog.belongsTo(Organization)
Organization.hasMany(MailLog)

MailLog.belongsTo(Person)
Person.hasMany(MailLog)

module.exports = MailLog
