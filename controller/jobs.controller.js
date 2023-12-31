const { catchAsync } = require('../helpers/catchAsync')
const { Op } = require('sequelize')

const Email = require('../helpers/email')
const Organization = require('../schemas/organization')
const ContractPerson = require('../schemas/contractPerson')
const Person = require('../schemas/person')
const { CONTRACT_ROLES, EXPIRED_CONTRACT_TEXT_KEY, MAIL_MOTIVE, MONTHS_IN_SPANISH, CONTRACT_STATES } = require('../constants')
const Contract = require('../schemas/contract')
const Parameter = require('../schemas/parameter')
const MailLog = require('../schemas/maillog')
const Debt = require('../schemas/debt')
const Property = require('../schemas/property')
const Eventuality = require('../schemas/eventuality')
const ContractPrice = require('../schemas/contractPrice')
const Expense = require('../schemas/expense')
const Payment = require('../schemas/payment')
const { all, paginate } = require('../generic/factoryControllers')

exports.GetAll = all(MailLog, {
  include: [
    {
      model: Organization,
      attributes: ['id', 'name'],
    },
    {
      model: Person,
      attributes: ['id', 'fullName', 'email'],
    },
  ],
})
exports.Paginate = paginate(MailLog, {
  include: [
    {
      model: Organization,
      attributes: ['id', 'name'],
    },
    {
      model: Person,
      attributes: ['id', 'fullName', 'email'],
    },
  ],
})

exports.noticeExpiringContracts = catchAsync(async (req, res, next) => {
  const contracts = await Contract.findAll({
    where: {
      endDate: {
        [Op.between]: [new Date(), new Date(new Date().setDate(new Date().getDate() + 60))],
      },
      state: 'En curso',
    },
    include: [
      {
        model: Organization,
        attributes: ['id', 'name', 'email'],
        include: {
          model: Parameter,
          attributes: ['value'],
          where: { key: EXPIRED_CONTRACT_TEXT_KEY },
        },
      },
      {
        model: ContractPerson,
        attributes: ['role'],
        include: { model: Person, attributes: ['id', 'fullName', 'email'] },
        where: { role: CONTRACT_ROLES[0] },
      },
    ],
    attributes: ['endDate'],
  })
  //   if (1 === 1) return res.json({ ok: true, results: contracts.length, data: contracts })

  if (!contracts || contracts.length <= 0) return res.json({ ok: true, message: 'No hay contratos por vencerse en los proximos 60 dias' })

  contracts.forEach(async (contract) => {
    await new Email({
      email: contract.ContractPeople[0].Person.email,
      fullName: contract.ContractPeople[0].Person.fullName,
      endDate: contract.endDate,
      organizationName: contract.Organization.name,
      organizationEmail: contract.Organization.email,
      TEXT_VEN_CONT: contract.Organization.Parameters[0].value,
    }).sendExpireContract()

    // store in maillog
    await MailLog.create({
      motive: MAIL_MOTIVE.EXPIRED_CONTRACT,
      status: true,
      OrganizationId: contract.Organization.id,
      PersonId: contract.ContractPeople[0].Person.id,
    })
  })

  return res.json({ ok: true, results: contracts.length, data: contracts })
})

exports.noticeDebts = catchAsync(async (req, res, next) => {
  const contracts = await Contract.findAll({
    where: { state: 'En curso' },
    include: [
      {
        model: Debt,
        where: { paid: false, isOwner: false },
        attributes: ['id', 'amount', 'description', 'month', 'year', 'paid', 'isOwner', 'paidDate'],
      },
      {
        model: Organization,
        attributes: ['id', 'name', 'email'],
        // include: {
        //   model: Parameter,
        //   attributes: ['value'],
        //   where: { key: EXPIRED_CONTRACT_TEXT_KEY },
        // },
      },
      {
        model: ContractPerson,
        attributes: ['role'],
        include: { model: Person, attributes: ['id', 'fullName', 'email'] },
        // where: { role: CONTRACT_ROLES[0] },
      },
      { model: Property, attributes: ['id', 'street', 'number', 'floor', 'dept'] },
    ],
    attributes: ['id', 'startDate', 'endDate', 'state'],
  })
  // 44 avec debts
  // slice(2, 4).
  //   if (1 === 1) return res.json({ ok: true, results: contracts.length, data: contracts })
  if (!contracts || contracts.length <= 0) return res.json({ ok: true, message: 'No hay contratos con deudas' })

  contracts.forEach(async (con) => {
    // const monthsDebts = con.Debts.map((d) => d.month)
    // convert to a set to remove duplicates
    // get unique months of debts
    // convert back to array
    // const monthsDebtsUnique = [...monthsDebtsSet]
    // const ganrantes = await Assurance.findAll({ where: { ContractId: con.id } })
    // console.log('ContractId: ', con.id, 'Months: ', monthsDebts, 'MonthCleanSET ::', monthsDebtsSet, 'MonthCleanUnique ::', monthsDebtsUnique, 'Tiene : ', ganrantes.length, ' assurance(s)')

    const monthsDebtsUnique = [...new Set(con.Debts.map((d) => d.month))].sort((a, b) => b - a)

    console.log('ContractId: ', con.id, 'Months: ', monthsDebtsUnique)
    const person = con.ContractPeople.find((cp) => cp.role === CONTRACT_ROLES[0])
    const mailParams = {
      email: person.Person.email,
      fullName: person.Person.fullName,
      month: monthsDebtsUnique.map((m) => MONTHS_IN_SPANISH[m - 1]).join(', '),
      property: con.Property.street + ' ' + con.Property.number + ' ' + con.Property.floor + '-' + con.Property.dept,
      organizationName: con.Organization.name,
      organizationEmail: con.Organization.email,
    }

    console.log({ mailParams })

    if (monthsDebtsUnique.length === 1) {
      // send mail for one month
      try {
        await new Email(mailParams).sendNoticeDebtForOneMonth()
        // store in maillog
        await MailLog.create({
          motive: MAIL_MOTIVE.DEBT,
          status: true,
          OrganizationId: con.Organization.id,
          PersonId: person.Person.id,
        })
      } catch (error) {
        console.log('ERROR AL MANDAR LOS MAILS DE DEUDAS', error)
      }
    } else if (monthsDebtsUnique.length === 2) {
      // send mail for two months
      try {
        await new Email(mailParams).sendNoticeDebtForTwoMonth()
        // store in maillog
        await MailLog.create({
          motive: MAIL_MOTIVE.DEBT,
          status: true,
          OrganizationId: con.Organization.id,
          PersonId: person.Person.id,
        })
      } catch (error) {
        console.log('ERROR AL MANDAR LOS MAILS DE DEUDAS', error)
      }
    } else if (monthsDebtsUnique.length > 2) {
      // get assurance for each contract
      const ganrantes = await con.ContractPeople.filter((cp) => cp.role === CONTRACT_ROLES[1])
      //   console.log(ganrantes)

      if (monthsDebtsUnique.length === 3) {
        // send mail for three months
        try {
          await new Email(mailParams).sendNoticeDebtForThreeMonth()
          // store in maillog
          await MailLog.create({
            motive: MAIL_MOTIVE.DEBT,
            status: true,
            OrganizationId: con.Organization.id,
            PersonId: person.Person.id,
          })
        } catch (error) {
          console.log('ERROR AL MANDAR LOS MAILS DE DEUDAS', error)
        }
        // validate if the contract has assurance
        try {
          if (ganrantes.length > 0) {
            ganrantes.forEach(async (as) => {
              await new Email({
                ...mailParams,
                email: as.Person.email,
                assuranceName: as.Person.fullName,
              }).sendNoticeDebtForAssurance()

              // store in maillog
              await MailLog.create({
                motive: MAIL_MOTIVE.DEBT,
                status: true,
                OrganizationId: con.Organization.id,
                PersonId: as.Person.id,
              })
            })
          }
        } catch (error) {
          console.log('ERROR AL MANDAR LOS MAILS DE DEUDAS', error)
        }
      } else if (monthsDebtsUnique.length > 3) {
        // send mail for more than three months
        try {
          await new Email({
            ...mailParams,
            month:
              monthsDebtsUnique.map((m) => MONTHS_IN_SPANISH[m - 1]).join(', ') +
              ' ' +
              [...new Set(con.Debts.map((d) => d.year))].join('/ '),
            total: con.Debts.reduce((a, b) => a + b.amount, 0),
          }).sendNoticeDebtForFourMonth()
          // store in maillog
          await MailLog.create({
            motive: MAIL_MOTIVE.DEBT,
            status: true,
            OrganizationId: con.Organization.id,
            PersonId: person.Person.id,
          })
        } catch (error) {
          console.log('ERROR AL MANDAR LOS MAILS DE DEUDAS', error)
        }

        try {
          if (ganrantes.length > 0) {
            ganrantes.forEach(async (as) => {
              await new Email({
                email: as.Person.email,
                fullName: as.Person.fullName,
                assuranceName: as.Person.fullName,
                month:
                  monthsDebtsUnique.map((m) => MONTHS_IN_SPANISH[m - 1]).join(', ') +
                  ' ' +
                  [...new Set(con.Debts.map((d) => d.year))].join('/ '),
                total: con.Debts.reduce((a, b) => a + b.amount, 0),
              }).sendNoticeDebtForFourMonth()
              // store in maillog
              await MailLog.create({
                motive: MAIL_MOTIVE.DEBT,
                status: true,
                OrganizationId: con.Organization.id,
                PersonId: as.Person.id,
              })
            })
          }
        } catch (error) {
          console.log('ERROR AL MANDAR LOS MAILS DE DEUDAS', error)
        }
      }
    }
    return res.json({ ok: true, results: contracts.length })
  })

  // return res.json({ ok: true, results: contracts.length, data: contracts, })
})

exports.NoticeReceiptCurrentMonth = catchAsync(async (req, res, next) => {
  // get all contracts with state = 'En curso' and endDate > now and startDate < now
  const contracts = await Contract.findAll({
    where: {
      state: CONTRACT_STATES[1],
      endDate: { [Op.gt]: new Date() },
      startDate: { [Op.lt]: new Date() },
    },
    attributes: ['id', 'startDate', 'endDate', 'state', 'admFeesPorc'],
    include: [
      {
        model: Organization,
        attributes: ['id', 'name', 'email'],
      },
      {
        model: Property,
        attributes: ['id', 'street', 'number', 'floor', 'dept'],
        include: [
          { model: Person, attributes: ['fullName', 'docType', 'docNumber'] },
          {
            model: Eventuality,
            where: {
              clientPaid: null,
              clientAmount: { [Op.ne]: 0 },
            },
            required: false,
          },
        ],
      },
      {
        model: ContractPerson,
        where: {
          role: CONTRACT_ROLES[0],
        },
        attributes: ['role'],
        include: { model: Person, attributes: ['id', 'fullName', 'email', 'docType', 'docNumber'] },
      },
      { model: ContractPrice, limit: 1, attributes: ['amount'], order: [['createdAt', 'DESC']] },
      {
        model: Expense,
        where: {
          isOwner: false,
        },
        required: false,
      },
      // {
      //   model: Debt,
      //   where: {
      //     isOwner: false,
      //     paidDate: null,
      //     paid: 0,
      //     amount: { [Op.ne]: 0 },
      //   },
      //   required: false,
      // },
      {
        model: Eventuality,
        where: {
          clientPaid: null,
          clientAmount: { [Op.ne]: 0 },
        },
        required: false,
      },
    ],
  })

  // VALIDATE IF EACH CONTRACT HAS ALREADY PAID THE CURRENT MONTH
  const contractsToSend = []
  for (let i = 0; i < contracts.length; i++) {
    const payments = await Payment.findAll({
      where: {
        ContractId: contracts[i].id,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
    })
    if (payments.length <= 0) contractsToSend.push(contracts[i])
  }

  // SEND EMAIL TO EACH CONTRACT
  for (let i = 1; i < contractsToSend.length; i++) {
    const contract = contractsToSend[i]
    const { Property, ContractPeople, ContractPrices, Eventualities: eventsCont, Expenses } = contract
    const { Person: Client } = ContractPeople[0]
    const { Eventualities: eventsOwners } = Property
    const { amount } = ContractPrices[0]
    const { street, number, floor, dept } = Property

    const allEvents = [...eventsCont, ...eventsOwners]
    const period = MONTHS_IN_SPANISH[new Date().getMonth()] + ' ' + new Date().getFullYear()
    const subject = `Recibo de alquiler ${street} ${number} ${floor} ${dept} del periodo ${period} `
    const totalExpenses = Expenses.reduce((a, b) => a + b.amount, 0)
    // const totalDebts = Debts.reduce((a, b) => a + b.amount, 0)
    const totalEventualities = allEvents.reduce((a, b) => a + b.clientAmount, 0)
    const fessAmount = (amount * contract.admFeesPorc) / 100
    const admFees = '$' + fessAmount + ' |  GASTOS DE GESTION ' + period
    const property = street + ' ' + number + ' ' + floor + '-' + dept
    const total = amount + totalExpenses + totalEventualities + fessAmount
    const currentMonth = '$' + amount + '| ALQUILER ' + property + ' ' + period

    // const p = await Payment.create({
    //   month: new Date().getMonth() + 1,
    //   year: new Date().getFullYear(),
    //   amount,
    //   ContractId: contract.id,
    // })

    await new Email({
      subject,
      fullName: Client.fullName,
      email: Client.email,
      // property,
      organizationName: contract.Organization.name,
      organizationEmail: contract.Organization.email,
      currentMonth,
      // amount,
      period,
      Eventualities: allEvents,
      // Debts,
      admFees,
      Expenses,
      // totalExpenses,
      // totalDebts,
      total,
    }).sendReceiptCurrentMonth()
  }

  return res.json({
    ok: true,
    l1: contracts.length,
    l2: contractsToSend.length,
    status: 'success',
    message: 'Se enviaron los recibos correctamente',
    contractsToSend,
  })
})
