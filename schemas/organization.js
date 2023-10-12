const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = dbConnect.define(
  'Organization',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El nombre de la immobiliaria no puede ser nulo.',
        },
        notEmpty: {
          msg: 'El nombre de la immobiliaria no puede ser vacio.',
        },
        len: {
          args: [3, 50],
          msg: 'El nombre de la immobiliaria debe tener entre 3 a 50 caracteres.',
        },
      },
    },
    docType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El tipo de documento no puede ser nulo.',
        },
        notEmpty: {
          msg: 'El tipo de documento no puede ser vacio.',
        },
        isIn: {
          args: [['DNI', 'CUIT', 'CUIL', 'PASAPORTE']],
          msg: 'El tipo de documento debe ser DNI, CUIT ,CUIL o PASAPORTE.',
        },
      },
    },
    docNumber: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El número del documento no puede ser nulo.',
        },
        notEmpty: {
          msg: 'El número del documento no puede ser vacio.',
        },
      },
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El número del teléfono no puede ser nulo.',
        },
        notEmpty: {
          msg: 'El número del teléfono no puede ser vacio.',
        },
      },
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING(70),
      unique: {
        msg: 'Ya existe otra cuenta con ese correo.',
      },
      validate: {
        isEmail: {
          msg: 'EL correo no es valido.',
        },
        notNull: {
          msg: 'El correo no puede ser nulo.',
        },
        notEmpty: {
          msg: 'El correo no puede ser vacio.',
        },
      },
    },
    country: DataTypes.STRING(20),
    province: DataTypes.STRING(20),
    city: DataTypes.STRING(20),
    direction: DataTypes.STRING(20),
    avatar: DataTypes.STRING(200),
  },
  {
    tableName: 'organizations',
  }
)

module.exports = Organization
