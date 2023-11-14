const { CONTRACT_ROLES } = require('../constants')
const { all, paginate, create, findOne, update, destroy, destroyMultiple } = require('../generic/factoryControllers')
const Contract = require('../schemas/contract')
const ContractPerson = require('../schemas/contractPerson')
const Eventuality = require('../schemas/eventuality')
const Person = require('../schemas/person')
const Property = require('../schemas/property')

exports.GetAll = all(Eventuality, {
  include: [
    {
      model: Property,
      attributes: ['street', 'number', 'floor', 'dept', 'id'],
    },
    {
      model: Contract,
      include: [
        {
          model: Property,
          attributes: ['street', 'number', 'floor', 'dept', 'id'],
        },
        {
          model: ContractPerson,
          attributes: ['role', 'id'],
          where: {
            role: CONTRACT_ROLES[0],
          },
          include: [
            {
              model: Person,
              attributes: ['fullName', 'docType', 'docNumber', 'id'],
            },
          ],
        },
      ],
      attributes: ['id'],
    },
  ],
})
exports.Paginate = paginate(Eventuality, {
  include: [
    {
      model: Property,
      attributes: ['street', 'number', 'floor', 'dept', 'id'],
    },
    {
      model: Contract,
      include: [
        {
          model: Property,
          attributes: ['street', 'number', 'floor', 'dept', 'id'],
        },
        // {
        //   model: ContractPerson,
        //   attributes: ['role', 'id'],
        //   where: {
        //     role: CONTRACT_ROLES[0],
        //   },
        //   include: [
        //     {
        //       model: Person,
        //       attributes: ['fullName', 'docType', 'docNumber', 'id'],
        //     },
        //   ],
        // },
      ],
      attributes: ['id'],
    },
  ],
})
exports.Create = create(Eventuality)
exports.GetById = findOne(Eventuality)
exports.Put = update(Eventuality)
exports.Destroy = destroy(Eventuality)
exports.DestroyMultiple = destroyMultiple(Eventuality)
