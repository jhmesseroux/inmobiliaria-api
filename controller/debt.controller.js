const { all, findOne, update, destroy, create, paginate } = require('../generic/factoryControllers')
const { catchAsync } = require('../helpers/catchAsync')
const { Op } = require('sequelize')
const Debt = require('../schemas/debt')
const Contract = require('../schemas/contract')
const Property = require('../schemas/property')
const { dbConnect } = require('../db')
const { MONTHS_IN_SPANISH } = require('../constants')
const ContractPrice = require('../schemas/contractPrice')
const Expense = require('../schemas/expense')
const Payment = require('../schemas/Payment')
const AppError = require('../helpers/AppError')
const Person = require('../schemas/person')
const DebtLog = require('../schemas/debtlog')

exports.GetAll = all(Debt, { include: [{ model: Contract, include: [{ model: Property }] }] })
exports.Paginate = paginate(Debt, { include: [{ model: Contract, include: [{ model: Property }] }] })
exports.Post = create(Debt)
exports.GetById = findOne(Debt, { include: [{ model: Contract }] })
exports.Put = update(Debt, ['month', 'year', 'ContractId', 'amount', 'description'])
exports.Destroy = destroy(Debt)

exports.jobDebtsClients = catchAsync(async (req, res, next) => {
  const month = new Date().getMonth()
  const year = new Date().getFullYear()
  // previos month and current year
  const mothYearText = MONTHS_IN_SPANISH[month - 1] + '/' + year
  console.log(mothYearText, month, year)
  const d = new Date()
  console.log(d)
  d.setDate(d.getDate() + 3)

  // Get last date from last month
  const lastDateFromLastMonth = new Date(year, month - 1, new Date(year, month, 0).getDate())

  console.log(d)

  // if (!d) {
  //   return res.json({ ok: true, results: 0, data: [] })
  // }

  const docs2 = await Contract.findAll({
    where: {
      // id: {			// 	[Op.in]: req.query.ids.split(','),			// },
      state: 'En curso',
      startDate: { [Op.lt]: lastDateFromLastMonth },
      endDate: { [Op.gt]: d },
    },
    include: [
      {
        model: Expense,
        where: {
          isOwner: false,
        },
        required: false, // evita el left-join y hace un inner-join
      },
      { model: Property },
      { model: ContractPrice },
    ],
  })

  // res.json({ ok: true, results: docs2.length, data: docs2 })
  const transact = await dbConnect.transaction()

  try {
    for (let k = 0; k < docs2.length; k++) {
      const prevExps = []

      const pmtContr = await Payment.findAll({ where: { month, year, ContractId: docs2[k].id } })
      pmtContr.forEach((p) => prevExps.push(...p.expenseDetails))

      // if exist at least one debt already generated for this contract and month, then continue with the next contract
      const exist = await Debt.findOne({ where: { year, month, ContractId: docs2[k].id, isOwner: false } })
      // console.log(exist)
      const proText =
        docs2[k].Property.street + ' ' + docs2[k].Property.number + ' ' + docs2[k].Property.floor + ' ' + docs2[k].Property.dept
      if (!exist) {
        const textRent = 'ALQUILER ' + proText + mothYearText
        const currentContractPrice = docs2[k].ContractPrices.sort((a, b) => a.id - b.id)[docs2[k].ContractPrices.length - 1].amount

        // add rent debt
        if (prevExps.filter((pe) => pe.ContractId === docs2[k].id && pe.description === textRent).length <= 0) {
          await Debt.create(
            {
              description: textRent,
              amount: currentContractPrice,
              year,
              month,
              rent: true,
              ContractId: docs2[k].id,
              OrganizationId: docs2[k].OrganizationId,
            },
            { transaction: transact }
          )
        }

        // add admFeesPorc debt
        if (prevExps.filter((pe) => pe.ContractId === docs2[k].id && pe.description === `GASTOS DE GESTION ${mothYearText}`).length <= 0) {
          await Debt.create(
            {
              description: `GASTOS DE GESTION ${mothYearText}`,
              amount: currentContractPrice * (docs2[k].admFeesPorc / 100),
              year,
              month,
              ContractId: docs2[k].id,
              OrganizationId: docs2[k].OrganizationId,
            },
            { transaction: transact }
          )
        }

        for (let l = 0; l < docs2[k].Expenses.length; l++) {
          if (
            prevExps.filter(
              (pe) =>
                pe.ContractId === docs2[k].Expenses[l].ContractId &&
                pe.description === docs2[k].Expenses[l].description + ' ' + mothYearText
            ).length <= 0
          ) {
            // TODO -> consultar con alguien que sabe del tema si se debe agregar la deuda de AGUAS y API
            // if (
            //   (docs2[k].Expenses[l].description !== 'AGUAS' && docs2[k].Expenses[l].description !== 'API') ||
            //   (docs2[k].Expenses[l].description === 'AGUAS' && month % 2 === 0) ||
            //   (docs2[k].Expenses[l].description === 'API' && month % 2 !== 0)
            // ) {
            await Debt.create(
              {
                description: docs2[k].Expenses[l].description + ' ' + mothYearText,
                amount: docs2[k].Expenses[l].amount,
                year,
                month,
                ContractId: docs2[k].id,
                OrganizationId: docs2[k].OrganizationId,
              },
              { transaction: transact }
            )
            // }
          }
        }
      } else {
        console.log('Ya existe')
      }
      // add debtlog for client
      await DebtLog.create(
        {
          title: 'SE GENERARON CON EXITO LAS DEUDAS DE ' + mothYearText + ' PARA EL CONTRATO DE LA PROPIEDAD ' + proText,
          status: 'SUCCESS',
          OrganizationId: docs2[k].OrganizationId,
          ContractId: docs2[k].id,
          PersonId: null,
        },
        { transaction: transact }
      )
    }

    // await JobLog.create({ type: 'debts', state: 'success', message: 'DEBTS CLIENT JOB DONE SUCCESSFULLY.' })
    await transact.commit()
    return res.json({ ok: true, results: docs2.length, data: docs2 })
  } catch (error) {
    console.log('entroooooooooooooooooooooooooooooooooooooooooooooo')
    console.log(error)
    await transact.rollback()
    await DebtLog.create({
      title: 'ERROR AL GENERAR LAS DEUDAS DE ' + mothYearText + ' PARA LOS CONTARTOS ',
      status: 'FAIL',
      OrganizationId: null,
      ContractId: null,
      PersonId: null,
    })
    next(
      new AppError(
        error.errors?.map((e) => e.message),
        500
      )
    )
  }
})

exports.jobDebtsOwners = catchAsync(async (req, res, next) => {
  const month = req.query.month ? req.query.month : new Date().getMonth()
  const year = req.query.year ? req.query.year : new Date().getFullYear()
  const mothYearText = MONTHS_IN_SPANISH[month - 1] + '/' + year
  const d = new Date()
  d.setDate(d.getDate() + 3)
  const lastDateFromLastMonth = new Date(year, month - 1, new Date(year, month, 0).getDate())
  // get all the owners
  const owners = await Person.findAll({
    where: { isOwner: true },
    include: [
      {
        model: Property,
        where: {
          state: 'Ocupado',
        },
      },
    ],
  })

  // console.log(owners)

  if (1 + 1 == 2) return res.json({ ok: true, owners, message: 'No hay propietarios.' })

  const transact = await dbConnect.transaction()
  try {
    for (let i = 0; i < owners.length; i++) {
      if (owners[i].Properties.length > 0) {
        // get owner properties ids
        let propertyIds = owners[i].Properties.map((doc) => doc.id)

        // get contracts with owner properties ids
        const docs2 = await Contract.findAll({
          where: {
            PropertyId: { [Op.in]: propertyIds },
            state: 'En curso',
            startDate: { [Op.lt]: lastDateFromLastMonth },
            endDate: { [Op.gt]: d },
          },
          include: [
            {
              model: Expense,
              where: {
                isOwner: true,
              },
              required: false, // evita el left-join y hace un inner-join
            },
            { model: Property, include: [{ model: Person, attributes: ['id'] }] },
            { model: ContractPrice },
          ],
        })
        for (let k = 0; k < docs2.length; k++) {
          let prevExps = []
          let pmtContr = await Payment.findAll({ where: { month, year, PersonId: owners[i].id } })
          pmtContr.forEach((p) => prevExps.push(...p.expenseDetails))

          const exist = await Debt.findOne({ where: { year, month, ContractId: docs2[k].id, isOwner: true } })
          const currentContractPrice = docs2[k].ContractPrices.sort((a, b) => a.id - b.id)[docs2[k].ContractPrices.length - 1].amount

          if (!exist) {
            let textRent =
              'ALQUILER ' +
              docs2[k].Property.street +
              ' ' +
              docs2[k].Property.number +
              ' ' +
              docs2[k].Property.floor +
              ' ' +
              docs2[k].Property.dept +
              ' ' +
              mothYearText
            if (prevExps.filter((pe) => pe.ContractId === docs2[k].id && pe.description === textRent).length <= 0) {
              await Debt.create(
                {
                  description: textRent,
                  amount: currentContractPrice,
                  year,
                  month,
                  rent: true,
                  isOwner: true,
                  ContractId: docs2[k].id,
                  OrganizationId: docs2[k].OrganizationId,
                },
                { transaction: transact }
              )
            }
            let textFees =
              'HONORARIOS ' +
              docs2[k].Property.street +
              ' ' +
              docs2[k].Property.number +
              ' ' +
              docs2[k].Property.floor +
              ' ' +
              docs2[k].Property.dept +
              ' ' +
              mothYearText
            if (prevExps.filter((pe) => pe.ContractId === docs2[k].id && pe.description === textFees).length <= 0) {
              await Debt.create(
                {
                  description: textFees,
                  amount: -currentContractPrice * (docs2[k].commision / 100),
                  // amount: -currentContractPrice * (9 / 100),
                  year,
                  month,
                  isOwner: true,
                  ContractId: docs2[k].id,
                  OrganizationId: docs2[k].OrganizationId,
                },
                { transaction: transact }
              )
            }

            for (let l = 0; l < docs2[k].Expenses.length; l++) {
              if (
                prevExps.filter(
                  (pe) =>
                    pe.ContractId === docs2[k].Expenses[l].ContractId &&
                    pe.description === docs2[k].Expenses[l].description + ' ' + mothYearText
                ).length <= 0
              ) {
                // if (
                //   (docs2[k].Expenses[l].description !== 'AGUAS' && docs2[k].Expenses[l].description !== 'API') ||
                //   (docs2[k].Expenses[l].description === 'AGUAS' && month % 2 === 0) ||
                //   (docs2[k].Expenses[l].description === 'API' && month % 2 !== 0)
                // ) {
                await Debt.create(
                  {
                    description: docs2[k].Expenses[l].description + ' ' + mothYearText,
                    amount: docs2[k].Expenses[l].amount,
                    year,
                    month,
                    isOwner: true,
                    ContractId: docs2[k].id,
                    OrganizationId: docs2[k].OrganizationId,
                  },
                  { transaction: transact }
                )
                // }
              }
            }
          }
        }

        // add debtlog for owner
        await DebtLog.create(
          {
            title: 'SE GENERARON CON EXITO LAS DEUDAS DE ' + mothYearText + ' PARA EL PROPPIETARIO ' + owners[i].fullName,
            status: 'SUCCESS',
            OrganizationId: owners[i].OrganizationId,
            ContractId: null,
            PersonId: owners[i].id,
          },
          { transaction: transact }
        )
      }
    }
    // await JobLog.create({ type: 'debts', state: 'success', message: 'DEBTS OWNER JOB DONE SUCCESSFULLY.' }, { transaction: transact })

    await transact.commit()
    return res.json({ ok: true, message: 'DEBTS OWNER JOB DONE SUCCESSFULLY.' })
  } catch (error) {
    // await JobLog.create({ type: 'debts', state: 'fail', message: error.message || 'Something went wrong.' })
    await transact.rollback()
    await DebtLog.create({
      title: 'ERROR AL GENERAR LAS DEUDAS DE ' + mothYearText + ' PARA LOS PROPPIETARIOS ',
      status: 'FAIL',
      OrganizationId: null,
      ContractId: null,
      PersonId: null,
    })
    next(
      new AppError(
        error.errors.map((e) => e.message),
        500
      )
    )
  }
})

exports.Logs = paginate(DebtLog, {
  include: [
    {
      model: Contract,
      attributes: ['id', 'startDate', 'endDate', 'state'],
      include: [{ model: Property, attributes: ['id', 'street', 'number', 'floor', 'dept'] }],
    },
    { model: Person, attributes: ['id', 'fullName', 'docType', 'docNumber'] },
  ],
})
