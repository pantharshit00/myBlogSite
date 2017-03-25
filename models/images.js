const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Image = sequelize.define('images', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    imageName: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
    }
}, {
        timestamps: false
    });

module.exports = Image;