const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')
const Property = require('./property')

const Budget = dbConnect.define(
  'Budget',
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
          msg: 'La propiedad es obligatoria.',
        },
        notEmpty: {
          msg: 'La propiedad es obligatoria.',
        },
      },
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING(25),
      validate: {
        notNull: {
          msg: 'El tipo no puede ser nulo.',
        },
        notEmpty: {
          msg: 'El tipo no puede ser nulo.',
        },
        isIn: {
          args: [['Factura', 'Recibo', 'Presupuesto', 'Expensas extraordinarias']],
          msg: 'El tipo no es valido.',
        },
        len: {
          args: [3, 25],
          msg: 'El tipo debe tener entre 3 y 25 caracteres.',
        },
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La descripcion no puede ser nula.',
        },
        notEmpty: {
          msg: 'La descripcion no puede ser nula.',
        },
        len: {
          args: [3, 255],
          msg: 'La descripcion debe tener entre 3 y 255 caracteres.',
        },
      },
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    state: {
      type: DataTypes.STRING(11),
      defaultValue: 'En curso',
      validate: {
        isIn: {
          args: [['En curso', 'Visto', 'Aprobado', 'Rechazado']],
          msg: 'El estado no es valido.',
        },
      },
    },
    charged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    belongsTo: {
      type: DataTypes.STRING(11),
      allowNull: false,
      validate: {
        isIn: {
          args: [['Inquilino', 'Propietario']],
          msg: 'El tipo no es valido.',
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

    category: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La categoria no puede ser nula.',
        },
        notEmpty: {
          msg: 'La categoria no puede ser nula.',
        },
        isIn: {
          args: [['Plomeria', 'Gasista', 'Electricista', 'Pintura', 'Albañileria', 'Materiales']],
          msg: 'La categoria no es valida.',
        },
      },
    },
    photo: DataTypes.STRING,
  },
  {
    tableName: 'budgets',
  }
)

Budget.belongsTo(Organization, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Organization.hasMany(Budget)

Budget.belongsTo(Property, { foreignKey: { allowNull: false } })
Property.hasMany(Budget)

module.exports = Budget
