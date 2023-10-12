const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')

const Person = dbConnect.define(
  'Person',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El nombre completo es obligatorio',
        },
        notEmpty: {
          msg: 'El nombre completo es obligatorio',
        },
      },
    },    
    OrganizationId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      // unique: {
      //   name: true,
      //   msg: 'Ya existe una persona con ese telefóno.',
      // },
      validate: {
        notNull: {
          msg: 'La organización es obligatoria.',
        },
        notEmpty: {
          msg: 'La organización es obligatoria.',
        },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      // unique: {
      //   name: true,
      //   msg: 'Ya existe una persona con ese telefóno.',
      // },
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El telefóno es obligatorio',
        },
        notEmpty: {
          msg: 'El telefóno es obligatorio',
        },
      },
    }, 
    email: {
      type: DataTypes.STRING(100),
      // unique: {
      //   name: true,
      //   msg: 'Ya existe una persona con ese email.',
      // },
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El email es obligatorio',
        },
        notEmpty: {
          msg: 'El email es obligatorio',
        },
      },
    },
    docType: {
      type: DataTypes.STRING(9),
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
        len: {
          args: [7, 15],
          msg: 'El número del documento debe tener entre 7 y 15 caracteres.',
        },
      },
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La dirección es obligatoria',
        },
        notEmpty: {
          msg: 'La dirección es obligatoria',
        },
      },
    },
    isOwner: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,      
    },
    // commision:  DataTypes.FLOAT,
    province: DataTypes.STRING(70),
    city: DataTypes.STRING(70),
    codePostal: DataTypes.STRING(10),
    // obs: DataTypes.STRING,
  },
  {
    tableName: 'persons',
    indexes: [
      {
        unique: true,
        fields: ["docType", "docNumber",'OrganizationId'],
        name: "docType_docNumber_OrganizationId_unique"
      },
      {
        unique: true,
        fields: ["email",'OrganizationId'],
        name: "email_organization_unique"
      },
      {
        unique: true,
        fields: ["phone", 'OrganizationId'],
        name:"phone_organization_unique"
      },
    ],
  }
)

Person.belongsTo(Organization, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
})
Organization.hasMany(Person)

module.exports = Person
