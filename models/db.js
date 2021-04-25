const Sequelize = require('sequelize')

const sequelize = new Sequelize('dxkxomjl', 'dxkxomjl', 'qBkavJzAESTJsEbF5-zT3UzFfGcjfGI8',{
    host: 'tuffi.db.elephantsql.com',
    dialect: 'postgres'
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}