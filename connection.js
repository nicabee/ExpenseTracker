const {Sequelize} = require ("sequelize");

const sequelize = new Sequelize("expense_tracker", "root", "",{
    host:"localhost",
    dialect: "mysql",
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        paranoid: true
    }
})

try{
    sequelize.authenticate();
}catch(err){
    console.log(err);
}

exports.sequelize = sequelize;