const { Op } = require('sequelize')

const filterQueryParams = (queryFiltered) => {
  const options = { ...queryFiltered }
  Object.keys(queryFiltered).forEach((k) => {
    if (queryFiltered[k].toString().split(':').length > 1) {
      const val = queryFiltered[k].toString().split(':')
      switch (val[1]) {
        case 'like':
          options[`${k}`] = {
            [Op.substring]: val[0]
          }
          break
        case 'eq':
          options[`${k}`] = {
            [Op.eq]: val[0]
          }
          break
        case 'ne':
          options[`${k}`] = {
            [Op.ne]: val[0]
          }
          break
        case 'gt':
          options[`${k}`] = {
            [Op.gt]: Number(val[0])
          }
          break
        case 'gte':
          options[`${k}`] = {
            [Op.gte]: Number(val[0])
          }
          break
        case 'lt':
          options[`${k}`] = {
            [Op.lt]: Number(val[0])
          }
          break
        case 'lte':
          options[`${k}`] = {
            [Op.lte]: Number(val[0])
          }
          break
        case 'between':
          options[`${k}`] = {
            [Op.between]: val[0].split(',').map((i) => Number(i))
          }
          break
        case 'or':
          options[`${k}`] = {
            [Op.or]: val[0].split(',').map((i) => (typeof i === 'number' ? Number(i) : i))
          }
          break
        case 'and':
          options[`${k}`] = {
            [Op.and]: val[0].split(',').map((i) => (typeof i === 'number' ? Number(i) : i))
          }
          break
        case 'notBetween':
          options[`${k}`] = {
            [Op.notBetween]: val[0].split(',').map((i) => Number(i))
          }
          break
        case 'in':
          options[`${k}`] = {
            [Op.in]: val[0].split(',').map((i) => (typeof i === 'number' ? Number(i) : i))
          }
          break
        case 'notIn':
          options[`${k}`] = {
            [Op.notIn]: val[0].split(',').map((i) => (typeof i === 'number' ? Number(i) : i))
          }
          break
        default:
          break
      }
    }
  })
  return options
}

module.exports = filterQueryParams
