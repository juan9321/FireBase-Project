const Sequelize = require("sequelize");
const sequelize = new Sequelize("banco", "root", "", {
    host: "localhost",
    dialect: "mysql"
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}