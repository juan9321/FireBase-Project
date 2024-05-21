const db = require("./banco")

const Cliente = db.sequelize.define("cliente",{
    nome: {
        type: db.Sequelize.STRING
    },
    endereco: {
        type: db.Sequelize.STRING
    },
    bairro: {
        type: db.Sequelize.STRING
    },
    cep: {
        type: db.Sequelize.STRING
    },
    cidade: {
        type: db.Sequelize.STRING
    },
    estado: {
        type: db.Sequelize.STRING
    }
})

// Cliente.sync({force: true})

module.exports = Cliente