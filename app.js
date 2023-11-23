const express = require('express')
const path = require('path')
const helmet = require('helmet')
const cors = require('cors')
const { globalError } = require('./Generic/errorControllers')
const morgan = require('morgan')
const AppError = require('./helpers/AppError')
const app = express()

app.use(cors())
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, '/uploads')))
// app.use(express.static(path.join(__dirname, 'public')))

// app.use(express.static(__dirname + '/uploads'))
app.use(helmet())

app.use(express.json({ limit: '20kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
// app.use(cookieParser())

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
  const { dbConnect } = require('./db/index')
  // require('./schemas/organization')
  // require('./schemas/account')
  // require('./schemas/zone')
  // require('./schemas/parameter')
  // require('./schemas/person')
  // require('./schemas/property')
  // require('./schemas/contract')
  // require('./schemas/contractPerson')
  // require('./schemas/contractPrice')
  // require('./schemas/debt')
  // require('./schemas/eventuality')
  // require('./schemas/expense')
  // require('./schemas/payment')
  // require('./schemas/debtlog')

  // require('./schemas/user')
  // require('./schemas/parametro')
  // dbConnect
  //   .sync({ alter: true })
  //   .then((res) => {
  //     console.log('DATABASE CONNECTED AND UPDATED!!!')
  //   })
  //   .catch((err) => console.log(err))
}

app.use(require('./routes'))
app.all('*', (req, res, next) => next(new AppError(`No existe esta ruta ${req.originalUrl}.`, 400)))

app.use(globalError)

module.exports = app

// TODO :: remove file when update catalogos or promotions
