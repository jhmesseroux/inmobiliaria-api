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
    OrganizationId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      unique: {
        name: 'name_organization_id_zone_unique',
        msg: 'Ya existe otra zona con ese nombre.',
      },
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
    motive: DataTypes.STRING // motivo de la finalización del contrato | motivo de la cancelación del contrato   
  },
  {
    tableName: 'contracts',
  }
)

Contract.belongsTo(Organization, {  foreignKey: { allowNull: false },  onDelete: 'CASCADE'})
Organization.hasMany(Contract)

ContractPrice.belongsTo(Contract, {  foreignKey: { allowNull: false },  onDelete: 'CASCADE'})
Contract.hasMany(ContractPrice)

Contract.belongsTo(Property, {  foreignKey: { allowNull: false },  onDelete: 'CASCADE'})
Property.hasMany(Contract)

Contract.belongsToMany(Person, { through: ContractPerson })
Person.belongsToMany(Contract, { through: ContractPerson })
Contract.hasMany(ContractPerson)
ContractPerson.belongsTo(Contract)
Person.hasMany(ContractPerson)
ContractPerson.belongsTo(Person)


module.exports = Contract
