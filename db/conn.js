const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('thought', 'root', '', {
    host: 'localhost', 
    dialect: 'mysql',
})

module.exports = sequelize