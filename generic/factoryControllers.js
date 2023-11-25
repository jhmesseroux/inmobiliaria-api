const { catchAsync } = require('../helpers/catchAsync')
const filterQueryParams = require('../helpers/filterqueryParams')

const filterFields = (obj, allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.create = (Model, allowedFileds) =>
  catchAsync(async (req, res) => {
    // console.log(req.user.OrganizationId)
    req.body.OrganizationId = req.body.OrganizationId || req.user.OrganizationId
    const insertedFileds = allowedFileds ? filterFields(req.body, allowedFileds) : req.body
    const doc = await Model.create(insertedFileds)
    return res.json({
      code: 200,
      status: 'success',
      ok: true,
      message: 'El registro fue guardado con éxito',
      data: doc,
    })
  })

exports.all = (Model, opts = null) =>
  catchAsync(async (req, res) => {
    let include = null
    if (opts && req.query.include === undefined) include = opts.include
    else include = undefined
    const queryFiltered = { ...req.query }
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'include', 'paranoid']
    excludeFields.forEach((el) => delete queryFiltered[el])

    console.log(req.query.paranoid, 'req.query.paranoid')

    const docs = await Model.findAll({
      where: filterQueryParams(queryFiltered),
      include,
      paranoid: req.query.paranoid === '1' ? false : true,
      attributes: req.query.fields
        ? req.query.fields
            .toString()
            .split(',')
            .map((el) => (el.includes(':') ? el.split(':') : el))
        : '',
      order: req.query.sort
        ? req.query.sort
            .toString()
            .split(',')
            .map((el) => el.split(':'))
        : [['id', 'desc']],
    })
    return res.json({
      status: 'success',
      ok: true,
      code: 200,
      results: docs.length,
      data: docs,
    })
  })

exports.paginate = (Model, opts = null) =>
  catchAsync(async (req, res, next) => {
    if (!req.query.limit || !req.query.page) {
      return next(new Error('El parametro limit y/o page es obligatorio para usar este metodo!'))
    }
    let include = null
    if (opts && req.query.include === undefined) include = opts.include
    else include = undefined
    const queryFiltered = { ...req.query }

    console.log(queryFiltered)

    const excludeFields = ['page', 'sort', 'limit', 'fields', 'include', 'paranoid']
    excludeFields.forEach((el) => delete queryFiltered[el])

    console.log(queryFiltered)

    // validate if some value is 'null' and replace with null
    // Object.keys(queryFiltered).forEach((el) => {
    //   if (queryFiltered[el] === 'null') queryFiltered[el] = null
    // })

    console.log(queryFiltered)

    // console.log(include)

    const page = parseInt(req.query.page) * 1 || 1
    const limit = parseInt(req.query.limit) * 1 || 50
    const offset = (page - 1) * limit
    const docs = await Model.findAll({
      where: filterQueryParams(queryFiltered),
      include,
      paranoid: req.query.paranoid === '1' ? false : true,
      limit,
      offset,
      // distinct: true,
      attributes: req.query.fields
        ? req.query.fields
            .toString()
            .split(',')
            .map((el) => (el.includes(':') ? el.split(':') : el))
        : '',
      order: req.query.sort
        ? req.query.sort
            .toString()
            .split(',')
            .map((el) => el.split(':'))
        : [['id', 'desc']],
    })
    // console.log(docs)
    return res.json({
      results: docs.length,
      code: 200,
      status: 'success',
      ok: true,
      page,
      offset,
      // total: docs.count,
      data: docs,
    })
  })

exports.findOne = (Model, opts = null) =>
  catchAsync(async (req, res, next) => {
    let include = null
    if (opts && req.query.include === undefined) include = opts.include
    else include = undefined
    const doc = await Model.findOne({
      where: {
        id: req.params.id,
      },
      paranoid: req.query.paranoid === '1' ? false : true,
      include,
      attributes: req.query.fields
        ? req.query.fields
            .toString()
            .split(',')
            .map((el) => (el.includes(':') ? el.split(':') : el))
        : '',
    })
    if (!doc) return next(new Error(`No hay registro para el ${req.params.id}`))
    return res.json({
      code: 200,
      status: 'success',
      ok: true,
      data: doc,
    })
  })

exports.bulk = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.bulkCreate(req.body)
    return res.json({
      code: 200,
      status: 'success',
      ok: true,
      message: 'Los registros fueron guardados con éxito',
      data: doc,
    })
  })

exports.update = (Model, allowedFileds) =>
  catchAsync(async (req, res, next) => {
    const insertedFileds = allowedFileds ? filterFields(req.body, allowedFileds) : req.body
    console.log(insertedFileds)
    const doc = await Model.update(insertedFileds, {
      where: { id: req.params.id },
    })
    if (doc[0] <= 0) {
      return next(new Error('No hay registro(s) con id : ' + req.params.id + ' o no se actualizó ningún registro.'))
    }
    return res.json({
      status: 'success',
      code: 200,
      ok: true,
      message: 'El registro fue actualizado con éxito',
    })
  })

exports.restore = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.restore({
      where: {
        id: req.params.id,
      },
    })
    if (doc[0] <= 0) {
      return next(new Error('No hay registro con id : ' + req.params.id))
    }
    return res.json({
      status: 'success',
      code: 200,
      ok: true,
      message: 'El registro fue restaurado con éxito',
    })
  })

exports.down = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.destroy({
      where: {
        id: req.params.id,
      },
    })
    if (doc <= 0) {
      return next(new Error('No hay registro con id : ' + req.params.id))
    }
    return res.status(200).json({
      code: 200,
      status: 'success',
      ok: true,
      message: 'El registro fue dado de baja con éxito',
      data: null,
    })
  })
exports.destroy = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.destroy({
      where: {
        id: req.params.id,
      },
    })
    if (doc <= 0) {
      return next(new Error('No hay registro con id : ' + req.params.id))
    }
    return res.status(200).json({
      code: 200,
      status: 'success',
      ok: true,
      message: 'El registro fue borrado con éxito',
      data: null,
    })
  })

exports.destroyMultiple = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.destroy({
      where: { id: req.body.ids },
    })
    if (doc <= 0) {
      return next(new Error('No hay registro(s).'))
    }
    return res.status(200).json({
      code: 200,
      status: 'success',
      ok: true,
      message: 'Los registros fueron borrados con éxito',
      data: null,
    })
  })
