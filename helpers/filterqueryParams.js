const { Op } = require('sequelize')

// value:oprator => 10:gt => { [Op.gt]: 10 }, 12,3,4:in , 1,0 : or

const filterQueryParams = (queryFiltered) => {
  const options = { ...queryFiltered }
  console.log('entroooooooooooooooooooooooo')
  console.log(options)
  Object.keys(queryFiltered).forEach((k) => {
    console.log('ahiiiiiiiiiiiiiiiiiiiiiiiiii')
    if (queryFiltered[k].toString().split(':').length > 1) {
      const val = queryFiltered[k].toString().split(':')
      switch (val[1]) {
        case 'like':
          options[`${k}`] = {
            [Op.substring]: val[0],
          }
          break
        case 'eq':
          options[`${k}`] = {
            [Op.eq]: val[0],
          }
          break
        case 'ne':
          options[`${k}`] = {
            [Op.ne]: val[0] === 'null' ? null : val[0],
          }
          break
        case 'gt':
          options[`${k}`] = {
            [Op.gt]: val[0],
          }
          break
        case 'gte':
          options[`${k}`] = {
            [Op.gte]: val[0],
          }
          break
        case 'lt':
          options[`${k}`] = {
            [Op.lt]: val[0],
          }
          break
        case 'lte':
          options[`${k}`] = {
            [Op.lte]: val[0],
          }
          break
        case 'between':
          options[`${k}`] = {
            [Op.between]: val[0].split(',').map((i) => i),
          }
          break
        case 'or':
          options[`${k}`] = {
            [Op.or]: val[0].split(',').map((i) => (typeof i === 'number' ? i : i)),
          }
          break
        case 'and':
          options[`${k}`] = {
            [Op.and]: val[0].split(',').map((i) => (typeof i === 'number' ? i : i)),
          }
          break
        case 'notBetween':
          options[`${k}`] = {
            [Op.notBetween]: val[0].split(',').map((i) => i),
          }
          break
        case 'in':
          options[`${k}`] = {
            [Op.in]: val[0].split(',').map((i) => (typeof i === 'number' ? i : i)),
          }
          break
        case 'notIn':
          options[`${k}`] = {
            [Op.notIn]: val[0].split(',').map((i) => (typeof i === 'number' ? i : i)),
          }
          break
        default:
          break
      }
    } else {
      options[`${k}`] = {
        [Op.eq]: queryFiltered[k] === 'null' ? null : queryFiltered[k],
      }
    }
  })

  console.log(';en llegoooooooooooooooooooooooooooooooo')

  console.log('LAST ::', options)
  return options
}

module.exports = filterQueryParams
