const { Op } = require('sequelize')
const { all, paginate, findOne, update, create } = require('../generic/factoryControllers')
const AppError = require('../helpers/AppError')
const { catchAsync } = require('../helpers/catchAsync')
const Property = require('../schemas/property')
const Contract = require('../schemas/contract')
const Person = require('../schemas/person')
const { dbConnect } = require('../db')
const ContractPerson = require('../schemas/contractPerson')
const ContractPrice = require('../schemas/contractPrice')
const { CONTRACT_ROLES, CONTRACT_STATES } = require('../constants')

exports.GetAll = all(Contract, {
  include: [
    { model: Property, include: { model: Person } },
    { model: ContractPerson, include: { model: Person } },
    { model: ContractPrice },
  ],
})
exports.Paginate = paginate(Contract, {
  include: [
    { model: Property, include: { model: Person } },
    { model: ContractPerson, include: { model: Person } },
    { model: ContractPrice },
  ],
})

exports.Post = catchAsync(async (req, res, next) => {
  const { PropertyId } = req.body

  const p = await Property.findOne({ where: { id: PropertyId, state: 'Libre' } })

  if (!p) return next(new AppError('La propiedad elegida no esta libre.', 400))

  await dbConnect.transaction(async (t) => {
    // create contract
    req.body.OrganizationId = req.body.OrganizationId || req.user.OrganizationId
    const cont = await Contract.create(req.body, { transaction: t })

    // update property state
    const updPro = await Property.update({ state: 'Ocupado' }, { where: { id: PropertyId }, transaction: t })

    if (updPro[0] <= 0) {
      await t.rollback()
      return next(new AppError('No se pudo actualizar el estado de la propiedad', 400))
    }

    // add  price
    await ContractPrice.create(
      {
        ContractId: cont.id,
        amount: req.body.amount,
        percent: 0,
      },
      { transaction: t }
    )

    // add inquilino
    await ContractPerson.create(
      {
        ContractId: cont.id,
        PersonId: req.body.PersonId,
        role: CONTRACT_ROLES[0],
      },
      { transaction: t }
    )

    // add garantes
    if (req.body.assurances && req.body.assurances.length > 0) {
      for (let j = 0; j < req.body.assurances.length; j++) {
        await ContractPerson.create(
          {
            ContractId: cont.id,
            PersonId: req.body.assurances[j].id,
            role: CONTRACT_ROLES[1],
          },
          { transaction: t }
        )
      }
    }

    return res.json({
      code: 200,
      status: 'success',
      ok: true,
      message: 'El contrato fue guardado con exito',
      data: cont,
    })
  })
})

exports.Put = update(Contract, ['startDate', 'endDate', 'deposit', 'booking', 'state', 'description', 'admFeesPorc', 'currency'])

exports.AddPrice = create(ContractPrice)

exports.AddGarantes = catchAsync(async (req, res, next) => {
  const { ContractId, assurances } = req.body
  if (!assurances || assurances.length <= 0) return next(new AppError('No se envió ningún garante', 400))
  await dbConnect.transaction(async (t) => {
    // eslint-disable-next-line semi-spacing
    for (let j = 0; j < assurances.length; j++) {
      await ContractPerson.create(
        {
          ContractId,
          PersonId: assurances[j],
          role: CONTRACT_ROLES[1],
        },
        { transaction: t }
      )
    }
    return res.json({
      code: 200,
      status: 'success',
      ok: true,
      message: 'Los garantes fueron agregados con exito',
    })
  })
})

exports.GetOwnerContracts = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const properties = await Property.findAll({
    where: {
      PersonId: id,
      state: 'Ocupado',
    },
    attributes: ['id'],
  })
  const ids = properties.map((p) => p.id)
  const contracts = await Contract.findAll({
    where: {
      PropertyId: { [Op.in]: ids },
      state: CONTRACT_STATES[1],
      startDate: { [Op.lte]: new Date() },
      // endDate: { [Op.gt]: new Date() }, // no va porque aveces el contrato finaliza pero el inquilino sigue viviendo o el adm no lo finaliza por x motivo
    },
    attributes: ['id', 'startDate', 'endDate', 'state', 'PropertyId', 'admFeesPorc'],
    include: [
      { model: ContractPrice, attributes: ['id', 'amount'] },
      { model: Property, attributes: ['id', 'street', 'number', 'floor', 'dept'] },
      {
        model: ContractPerson,
        attributes: ['role', 'id'],
        include: { model: Person, attributes: ['id', 'fullName', 'docType', 'DocNumber'] },
      },
    ],
  })
  return res.json({
    code: 200,
    status: 'success',
    ok: true,
    results: contracts.length,
    message: 'Lista de contratos',
    data: contracts,
  })
})

exports.GetById = findOne(Contract, {
  include: [
    // {
    //   model: Client
    // },
    {
      model: Property,
    },
    // {
    //   model: Assurance
    // },
    // {
    //   model: PriceHistorial
    // },
    // {
    //   model: ClientExpense
    // },
    // {
    //   model: OwnerExpense
    // }
  ],
})

exports.Destroy = catchAsync(async (req, res, next) => {
  const id = req.params.id

  const contract = await Contract.findOne({ where: { id } })
  if (!contract) return next(new AppError('No se encontró el contrato', 400))

  // const debts = await DebtClient.findAll({ where: { ContractId: id, paid: false } })
  // if (debts.length > 0) return next(new AppError('El inquilino tiene deudas pendientes,no se puede eliminar el contrato.', 400))

  // const payments = await DebtOwner.findAll({ where: { ContractId: id, paid: false } },)
  // if (payments.length > 0) return next(new AppError("El propietario tiene pagos pendientes,no se puede eliminar el contrato.", 400))

  // const events = await Eventuality.findAll(
  //   {
  //     where: {
  //       PropertyId: contract.PropertyId,
  //       clientAmount: { [Op.ne]: 0 },
  //       clientPaid: false
  //     }
  //   }
  // )

  // if (events.length > 0) return next(new AppError('El inquilino tiene eventualidades sin pagar/cobrar,no se puede eliminar el contrato.', 400))

  // const eventsOwners = await Eventuality.findAll(
  //   {
  //     where: {
  //       PropertyId: contract.PropertyId,
  //       ownerAmount: { [Op.ne]: 0 },
  //       ownerPaid: false,
  //     },
  //   },
  // )

  // if (eventsOwners.length > 0) return next(new AppError("El propietario tiene eventualidades sin pagar/cobrar,no se puede eliminar el contrato.", 400))

  await dbConnect.transaction(async (t) => {
    await Property.update(
      { state: 'Libre' },
      {
        where: { id: contract.PropertyId },
        transaction: t,
      }
    )

    await Contract.update({ state: 'Finalizado' }, { where: { id }, transaction: t })
    await Contract.destroy({ where: { id }, transaction: t })
    return res.json({
      ok: true,
      status: 'success',
      message: 'El registro fue eliminado con exito',
    })
  })
})

exports.finish = catchAsync(async (req, res, next) => {
  const id = req.params.id

  const contract = await Contract.findOne({ where: { id } })
  if (!contract) return next(new AppError('No se encontró el contrato', 400))

  // const debts = await DebtClient.findAll({ where: { ContractId: id, paid: false } })
  // if (debts.length > 0) return next(new AppError('El inquilino tiene deudas pendientes,no se puede finalizar el contrato.', 400))

  // // const payments = await DebtOwner.findAll({ where: { ContractId: id, paid: false } },)
  // // if (payments.length > 0) return next(new AppError("El propietario tiene pagos pendientes,no se puede finalizar el contrato.", 400))

  // const events = await Eventuality.findAll(
  //   {
  //     where: {
  //       PropertyId: contract.PropertyId,
  //       clientAmount: { [Op.ne]: 0 },
  //       clientPaid: false
  //     }
  //   }
  // )

  // if (events.length > 0) return next(new AppError('El inquilino tiene eventualidades sin pagar/cobrar,no se puede finalizar el contrato.', 400))

  // const eventsOwners = await Eventuality.findAll(
  //   {
  //     where: {
  //       PropertyId: contract.PropertyId,
  //       ownerAmount: { [Op.ne]: 0 },
  //       ownerPaid: false,
  //     },
  //   },
  // )
  // if (eventsOwners.length > 0) return next(new AppError("El propietario tiene eventualidades sin pagar/cobrar,no se puede finalizar el contrato.", 400))

  await dbConnect.transaction(async (t) => {
    await Property.update(
      { state: 'Libre' },
      {
        where: { id: contract.PropertyId },
        transaction: t,
      }
    )

    await Contract.update({ state: 'Finalizado', motive: req.body.motive }, { where: { id }, transaction: t })
    return res.json({
      ok: true,
      status: 'success',
      message: 'El contrato se finalizó con éxito',
    })
  })
})

// exports.ExpiredContracts = catchAsync(async (req, res, next) => {
//   const days = req.params.days * 1

//   const docs = await Contract.findAll({
//     where: {
//       [Op.or]: [
//         sequelize.where(
//           sequelize.fn(
//             'datediff',
//             sequelize.fn('NOW'),
//             sequelize.col('startDate')
//           ),
//           {
//             [Op.between]: [365.25 - days, 365.25]
//           }
//         ),
//         sequelize.where(
//           sequelize.fn(
//             'datediff',
//             sequelize.fn('NOW'),
//             sequelize.col('startDate')
//           ),
//           {
//             [Op.between]: [730.5 - days, 730.5]
//           }
//         ),
//         sequelize.where(
//           sequelize.fn(
//             'datediff',
//             sequelize.fn('NOW'),
//             sequelize.col('startDate')
//           ),
//           {
//             [Op.between]: [1095.75 - days, 1095.75]
//           }
//         )
//       ],
//       state: 'En curso'
//     },
//     include: [
//       // { model: Client },
//       { model: Property, include: { model: Person } }
//       // { model: PriceHistorial }
//     ]
//   })

//   return res.json({
//     results: docs.length,
//     ok: true,
//     status: 'success',
//     data: docs
//   })
// })

exports.HistorialPrice = all(Contract, {
  include: [
    // { model: PriceHistorial },
    { model: Property, include: { model: Person } },
  ],
})

// para obtener las deudas pagas o impagas de los clientes
exports.DebtsClients = catchAsync(async (req, res, next) => {
  const docs = await Contract.findAll({
    include: [
      // { model: Client },
      { model: Property, include: { model: Person } },
      // { model: PriceHistorial },
      // { model: DebtClient }
    ],
  })

  return res.json({
    results: docs.length,
    ok: true,
    status: 'success',
    data: docs,
  })
})

//  para obtener las deudas pagas o impagas de los propietarios
exports.DebtsOwners = catchAsync(async (req, res, next) => {
  const docs = await Contract.findAll({
    include: [
      // { model: Client },
      { model: Property, include: { model: Person } },
      // { model: PriceHistorial },
      // { model: DebtOwner }
    ],
  })

  return res.json({
    results: docs.length,
    ok: true,
    status: 'success',
    data: docs,
  })
})
