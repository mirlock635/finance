const { DataTypes } = require('sequelize');
const sequelize= require('../config/db')

const USER= sequelize.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    created_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },{underscored: true, timestamps: false, });
  
module.exports =USER