const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')
const { CONTRACT_STATES } = require('../constants')
const ContractPrice = require('./contractPrice')
const Property = require('./property')
const Person = require('./person')
const ContractPerson = require('./contractPerson')

const Contract = dbConnect.define(
  'Contract',
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
          msg: 'El propietario es obligatorio',
        },
        notEmpty: {
          msg: 'El propietario es obligatorio',
        },
      },
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      validate: {
        notNull: {
          msg: 'La fecha del comienzo es obligatoria',
        },
        notEmpty: {
          msg: 'La fecha del comienzo es obligatoria',
        },
      },
    },
    endDate: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      validate: {
        notNull: {
          msg: 'La fecha fin es obligatoria',
        },
        notEmpty: {
          msg: 'La fecha fin es obligatoria',
        },
        isGreaterThanStartDate(value) {
          if (value <= this.startDate) {
            throw new Error('La fecha fin del contrato debe ser mayor que la fecha de inicio.')
          }
        },
      },
    },
    admFeesPorc: {
      allowNull: false,
      type: DataTypes.FLOAT,
      defaultValue: 2,
      // gastos de administración | gestión | comisión
    },
    // currency: {
    //   allowNull: false,
    //   type: DataTypes.STRING(3),
    //   defaultValue: 'ARS',
    //   validate: {
    //     isIn: {
    //       args: [['ARS', 'USD']],
    //       msg: 'La moneda igresada no está permitida.',
    //     },
    //   }
    // },
    state: {
      type: DataTypes.STRING(10),
      defaultValue: 'En curso',
      validate: {
        isIn: {
          args: [CONTRACT_STATES],
          msg: 'El estado ingresado no está permitido.',
        },
      },
    },
    comission: {
      allowNull: false,
      type: DataTypes.FLOAT,
      validate: {
        notNull: {
          msg: 'La comisión es obligatoria.',
        },
        notEmpty: {
          msg: 'La comisión es obligatoria.',
        },
      },
    },
    OrganizationId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      validate: {
        notNull: {
          msg: 'La organización es obligatoria.',
        },
        notEmpty: {
          msg: 'La organización es obligatoria.',
        },
      },
    },
    booking: DataTypes.FLOAT, // reserva | seña
    deposit: DataTypes.FLOAT,
    description: DataTypes.STRING,
    motive: DataTypes.STRING, // motivo de la finalización del contrato | motivo de la cancelación del contrato
  },
  {
    tableName: 'contracts',
    indexes: [
      {
        unique: true,
        fields: ['OrganizationId', 'PropertyId', 'startDate', 'state'],
        name: 'property_organization_state_unique',
      },
    ],
  }
)

Contract.belongsTo(Organization, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Organization.hasMany(Contract)

ContractPrice.belongsTo(Contract, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Contract.hasMany(ContractPrice)

Contract.belongsTo(Property, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Property.hasMany(Contract)

Contract.hasMany(ContractPerson)
ContractPerson.belongsTo(Contract)

// Contract.belongsToMany(Person, { through: ContractPerson })
// Person.belongsToMany(Contract, { through: ContractPerson, uniqueKey: false })

// Setup a One-to-Many relationship between User and Grant
// User.hasMany(Grant);
// Grant.belongsTo(User);

// Also setup a One-to-Many relationship between Profile and Grant
// Profile.hasMany(Grant);
// Grant.belongsTo(Profile);

// Contract.hasMany(ContractPerson)
// ContractPerson.belongsTo(Contract)
Person.hasMany(ContractPerson)
ContractPerson.belongsTo(Person)

module.exports = Contract
