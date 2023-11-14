'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Eventuality extends Model {
		static associate(models) {
			//  Relation
			// Eventuality.belongsTo(models.Contract)
			Eventuality.belongsTo(models.Property)
		}
	}
	Eventuality.init(
		{
			id: {
				primaryKey: true,
				allowNull: false,
				type: DataTypes.BIGINT,
				autoIncrement: true
			},
			PropertyId: {
				allowNull: false,
				type: DataTypes.BIGINT,
				validate: {
					notNull: {
						msg: 'La propiedad es obligatoria.'
					},
					notEmpty: {
						msg: 'La propiedad es obligatoria.'
					}
				}
			},
			paymentId: DataTypes.BIGINT,
			// ContractId: {
			// 	allowNull: false,
			// 	type: DataTypes.BIGINT,
			// 	validate: {
			// 		notNull: {
			// 			msg: 'El contrato es obligatorio.',
			// 		},
			// 		notEmpty: {
			// 			msg: 'El contrato es obligatorio.',
			// 		},
			// 	},
			// },
			clientAmount: {
				allowNull: false,
				type: DataTypes.FLOAT,
				validate: {
					notNull: {
						msg: 'El monto del cliente es obligatorio.'
					},
					notEmpty: {
						msg: 'El monto del cliente es obligatorio.'
					}
				}
			},
			ownerAmount: {
				allowNull: false,
				type: DataTypes.FLOAT,
				validate: {
					notNull: {
						msg: 'El monto del dueño es obligatorio.'
					},
					notEmpty: {
						msg: 'El monto del dueño es obligatorio.'
					}
				}
			},
			clientPaid: {
				allowNull: false,
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			isReverted: {
				allowNull: false,
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			ownerPaid: {
				allowNull: false,
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			description: {
				allowNull: false,
				type: DataTypes.STRING,
				validate: {
					notNull: {
						msg: 'La descripción es obligatoria.'
					},
					notEmpty: {
						msg: 'La descripción es obligatoria.'
					}
				}
			},
			expiredDate: {
				allowNull: false,
				type: DataTypes.DATEONLY,
				validate: {
					notNull: {
						msg: 'La fecha de vencimiento es obligatoria.'
					},
					notEmpty: {
						msg: 'La fecha de vencimiento es obligatoria.'
					}
				}
			}
		},
		{
			sequelize,
			modelName: 'Eventuality',
			tableName: 'eventualities'
			// paranoid: true,
		}
	)
	return Eventuality
}
