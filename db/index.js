const { Sequelize } = require('sequelize')

exports.dbConnect = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: true,
  },
  logging: false,
  // logging: process.env.NODE_ENV !== 'production',
})

// TODO: user enviroment variable to set the database name and password for production
