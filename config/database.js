const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST
});

sequelize.sync().then(()=>{
    console.log("connected to database at http://localhost:5432");
});

module.exports = sequelize;