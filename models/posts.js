const Sequelize = require('sequelize');
const sequelize = require('../config/database');

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

module.exports = Post;
