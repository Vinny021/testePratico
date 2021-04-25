const db = require('./db')

const Cidade = db.sequelize.define('cidades', {
    nome:{
        type: db.Sequelize.STRING
    },
    numero:{
        type: db.Sequelize.INTEGER
    }
})

module.exports = Cidade