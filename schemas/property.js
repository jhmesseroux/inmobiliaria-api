const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Organization = require('./organization')
const Person = require('./person')
const Zone = require('./zone')
const PropertyType = require('./propertyType')

const Property = dbConnect.define(
  'Property',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING(50),
      validate: {
        notNull: {
          msg: 'La localidad es obligatoria',
        },
        notEmpty: {
          msg: 'La localidad es obligatoria',
        },
      },
    },
    province: {
      allowNull: false,
      type: DataTypes.STRING(50),
      validate: {
        notNull: {
          msg: 'La provincia es obligatoria',
        },
        notEmpty: {
          msg: 'La provincia es obligatoria',
        },
      },
    },
    ZoneId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      validate: {
        notNull: {
          msg: 'La zona es obligatoria',
        },
        notEmpty: {
          msg: 'La zona es obligatoria',
        },
      },
    },
    PropertyTypeId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      validate: {
        notNull: {
          msg: 'El tipo de propiedad es obligatorio',
        },
        notEmpty: {
          msg: 'El tipo de propiedad es obligatorio',
        },
      },
    },
    PersonId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      validate: {
        notNull: {
          msg: 'El dueño es obligatorio',
        },
        notEmpty: {
          msg: 'El dueño es obligatorio',
        },
      },
    },
    street: {
      allowNull: false,
      type: DataTypes.STRING(50),
      validate: {
        notNull: {
          msg: 'La calle es obligatoria',
        },
        notEmpty: {
          msg: 'La calle es obligatoria',
        },
        len: {
          args: [1, 50],
          msg: 'La calle debe tener entre 1 y 50 caracteres',
        },
      },
    },
    number: {
      allowNull: false,
      type: DataTypes.STRING(5),
      validate: {
        notNull: {
          msg: 'El número de la calle es obligatorio',
        },
        notEmpty: {
          msg: 'El número de la calle es obligatorio',
        },
        len: {
          args: [1, 5],
          msg: 'El número de la calle debe tener entre 1 y 5 caracteres',
        },
      },
    },
    isFor: {
      allowNull: false,
      type: DataTypes.STRING(8),
      defaultValue: 'Alquiler',
      validate: {
        isIn: {
          args: [['Venta', 'Alquiler']],
          msg: 'El valor ingresado no está permitido.',
        },
        len: {
          args: [1, 8],
          msg: 'El para debe tener entre 1 y 8 caracteres.',
        },
      },
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING(7),
      defaultValue: 'Libre',
      validate: {
        isIn: {
          args: [['Libre', 'Ocupado']],
          msg: 'El estado ingresado no está permitido.',
        },
      },
    },
    folderNumber: {
      allowNull: true,
      type: DataTypes.STRING(10),
      unique: {
        name: 'folderNumber_pty__unique',
        msg: 'Ya existe una propiedad con ese número de carpeta.',
      },
      len: {
        args: [1, 10],
        msg: 'El número de carpeta debe tener entre 1 y 10 caracteres.',
      },
    },
    OrganizationId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      unique: {
        name: 'folderNumber_pty__unique',
        msg: 'Ya existe una propiedad con ese número de carpeta.',
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
    description: DataTypes.STRING,
    nroPartWater: DataTypes.STRING(50),
    nroPartMuni: DataTypes.STRING(50),
    nroPartAPI: DataTypes.STRING(50),
    nroPartGas: DataTypes.STRING(50),
    floor: DataTypes.STRING(3),
    dept: DataTypes.STRING(3),
  },
  {
    tableName: 'properties',
  }
)

Property.belongsTo(Organization, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Property.belongsTo(Person, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Property.belongsTo(Zone, { foreignKey: { allowNull: false }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
Property.belongsTo(PropertyType, { foreignKey: { allowNull: false }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' })

Person.hasMany(Property)
Organization.hasMany(Property)
// Property.hasMany(models.Visit, { foreignKey: { allowNull: false, }, onUpdate: 'CASCADE', onDelete: 'RESTRICT', })
// Property.hasMany(models.Claim, { foreignKey: { allowNull: false, }, onUpdate: 'CASCADE', onDelete: 'RESTRICT', })

module.exports = Property
