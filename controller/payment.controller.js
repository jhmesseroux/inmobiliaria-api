const { MONTHS_IN_SPANISH } = require('../constants')
const { dbConnect } = require('../db')
const { all, paginate, findOne, update } = require('../generic/factoryControllers')
const { catchAsync } = require('../helpers/catchAsync')
const Contract = require('../schemas/contract')
const ContractPerson = require('../schemas/contractPerson')
const Debt = require('../schemas/debt')
const Eventuality = require('../schemas/eventuality')
const Payment = require('../schemas/payment')
const PaymentType = require('../schemas/paymentType')
const Person = require('../schemas/person')
const Property = require('../schemas/property')

exports.GetAll = all(Payment, {
  include: [
    {
      model: Contract,
      include: [
        {
          model: Property,
          include: [
            {
              model: Person,
            },
          ],
        },
        {
          model: ContractPerson,
          include: [
            {
              model: Person,
            },
          ],
        },
      ],
    },
    {
      model: PaymentType,
    },
    {
      model: Person,
    },
  ],
})
exports.Paginate = paginate(Payment, {
  include: [
    {
      model: Contract,
      include: [
        {
          model: Property,
          include: [
            {
              model: Person,
            },
          ],
        },
        {
          model: ContractPerson,
          include: [
            {
              model: Person,
            },
          ],
        },
      ],
    },
    {
      model: PaymentType,
    },
    {
      model: Person,
    },
  ],
})

const periodTemplate = (data) => {
  const monthSet = new Set()
  const yearSet = new Set()
  // validate if the payment has some debt
  const prevDebts = data.expenseDetails
    .filter((item) => item.hasOwnProperty('debt'))
    .map((item) => ({ month: item.month, year: item.year }))
  // validate if the payment was for the actual month
  const curMonthPaid = data.expenseDetails.filter((item) => item.hasOwnProperty('paidCurrentMonth'))
  if (prevDebts.length > 0) {
    prevDebts.forEach((item) => {
      monthSet.add(item.month)
      yearSet.add(item.year)
    })
  }
  if (curMonthPaid.length > 0 || (prevDebts.length === 0 && curMonthPaid.length === 0)) {
    monthSet.add(data.month)
    yearSet.add(data.year)
  }
  return (
    Array.from(monthSet)
      .map((item) => MONTHS_IN_SPANISH[item - 1])
      .join('-') +
    '/' +
    Array.from(yearSet).join('-')
  )
}

exports.Post = catchAsync(async (req, res, next) => {
  const transact = await dbConnect.transaction()
  console.log(req.body)
  req.body.OrganizationId = req.user.OrganizationId
  try {
    let paidCurMonth = false
    if (req.body.expenseDetails.length > 0) {
      for (let j = 0; j < req.body.expenseDetails.length; j++) {
        if (req.body.expenseDetails[j]?.debt) {
          await Debt.update(
            {
              paid: true,
              paidDate: new Date(),
            },
            {
              where: {
                id: req.body.expenseDetails[j].id,
              },
              transaction: transact,
            }
          )
        }

        if (req.body.expenseDetails[j].hasOwnProperty('paidCurrentMonth')) {
          paidCurMonth = true
        }
      }
    }
    req.body.paidCurrentMonth = paidCurMonth

    const payment = await Payment.create(req.body, { transaction: transact })

    if (req.body.paidTotal && req.body.paidTotal > 0 && req.body.paidTotal !== req.body.total) {
      // add a eventualities with the difference
      let text = req.body.paidTotal > req.body.total ? 'A cuenta ' : 'Saldo '
      const monthAndYearText = periodTemplate(req.body)
      await Eventuality.create(
        {
          description: text + monthAndYearText,
          title: text + monthAndYearText,
          // req.body.month + '/' + req.body.year,
          ownerAmount: 0,
          clientAmount: req.body.total - req.body.paidTotal,
          amount: req.body.total - req.body.paidTotal,
          clientPaid: null,
          isReverted: true,
          ownerPaid: null,
          expiredDate: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, //actual date plus 1 month
          ContractId: req.body.ContractId,
          paymentId: payment.id,
          OrganizationId: req.user.OrganizationId,
        },
        {
          transaction: transact,
        }
      )
    }

    if (req.body.eventualityDetails.length > 0) {
      for (let j = 0; j < req.body.eventualityDetails.length; j++) {
        await Eventuality.update(
          { clientPaid: new Date() },
          {
            where: { id: req.body.eventualityDetails[j].id },
            transaction: transact,
          }
        )
      }
    }

    await transact.commit()
    return res.json({
      code: 200,
      status: 'success',
      ok: true,
      message: 'EL pago fue registrado con exito',
      data: payment,
    })
  } catch (error) {
    await transact.rollback()
    // return next()
    throw error
  }
})

exports.GetById = findOne(Payment, {
  include: [
    {
      model: Contract,
    },
    {
      model: PaymentType,
    },
  ],
})

exports.Put = update(Payment, ['PaymentTypeId', 'recharge', 'total', 'month', 'year', 'eventualityDetails', 'ExpenseDetails', 'obs'])
exports.allDebt = (req, res, next) => {}

exports.Destroy = catchAsync(async (req, res, next) => {
  const payment = await Payment.findByPk(req.params.id)
  if (!payment) return next(new AppError('El pago no existe ', 404))
  console.log('entroooooooo')

  const transact = await dbConnect.transaction()
  try {
    if (payment.expenseDetails.length > 0) {
      for (let j = 0; j < payment.expenseDetails.length; j++) {
        if (payment.expenseDetails[j].debt && !payment.expenseDetails[j].recharge) {
          await Debt.update(
            {
              paid: false,
              paidDate: null,
            },
            {
              where: {
                id: payment.expenseDetails[j].id,
              },
              transaction: transact,
            }
          )
        } else {
          if (payment.month == new Date().getMonth() + 1 && payment.year == new Date().getFullYear()) {
          } else {
            if (!payment.expenseDetails[j].recharge) {
              console.log('CREATED DEBT ::: ', payment.expenseDetails[j])
              await Debt.create(
                {
                  ContractId: payment.expenseDetails[j].ContractId,
                  amount: payment.expenseDetails[j].amount,
                  description: payment.expenseDetails[j].description,
                  month: payment.month,
                  year: payment.year,
                },
                { transaction: transact }
              )
            }
          }
        }
      }
    }
    // remove the eventuality added when the client did an partial payment
    await Eventuality.destroy({
      where: { paymentId: payment.id, isReverted: true },
      transaction: transact,
    })

    if (payment.eventualityDetails.length > 0) {
      for (let j = 0; j < payment.eventualityDetails.length; j++) {
        await Eventuality.update(
          { clientPaid: null },
          {
            where: { id: payment.eventualityDetails[j].id },
            transaction: transact,
          }
        )
      }
    }

    await Payment.destroy({ where: { id: req.params.id }, force: true }, { transaction: transact })
    await transact.commit()
    return res.json({
      code: 200,
      status: 'success',
      ok: true,
      message: 'El pago fue revertido con exito',
      //   data: payment,
    })
  } catch (error) {
    await transact.rollback()
    throw error
  }
})
