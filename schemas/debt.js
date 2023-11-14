const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')
const Contract = require('./contract')

const Debt = dbConnect.define(
  'Debt',
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
      validate: {
        notNull: {
          msg: 'La organización es obligatoria.',
        },
        notEmpty: {
          msg: 'La organización es obligatoria.',
        },
      },
    },
    ContractId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      validate: {
        notNull: {
          msg: 'El contrato es obligatorio',
        },
        notEmpty: {
          msg: 'El contrato es obligatorio',
        },
      },
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El mes es obligatorio',
        },
        notEmpty: {
          msg: 'El mes es obligatorio',
        },
        isIn: {
          args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
          msg: 'El mes debe ser entre 1 y 12',
        },
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El año es obligatorio',
        },
        notEmpty: {
          msg: 'El año es obligatorio',
        },
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El monto  es obligatorio',
        },
        notEmpty: {
          msg: 'El  monto  es obligatorio',
        },
      },
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La descripción  es obligatoria',
        },
        notEmpty: {
          msg: 'La descripción  es obligatoria',
        },
      },
    },
    paid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    rent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    debt: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    paidDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    isOwner: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },

  {
    tableName: 'debts',
  }
)

Debt.belongsTo(Organization, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Organization.hasMany(Debt)

Debt.belongsTo(Contract)
Contract.hasMany(Debt)

module.exports = Debt
