const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE,process.env.DB_USERAME,process.env.DB_PASSWORD,{
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST
});

const Post = sequelize.define('blog',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type:Sequelize.TEXT,
        allowNull: false
    },
    preview: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    content: {
        type:Sequelize.TEXT,
        allowNull: false
    }
})

sequelize.sync().then(()=>{
    console.log("connected to database at http://localhost:5432");
});

module.exports = Post;
