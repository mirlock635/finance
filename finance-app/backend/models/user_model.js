const { DataTypes } = require('sequelize');
const sequelize= require('./db')

const USER= sequelize.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
  
module.exports =USER