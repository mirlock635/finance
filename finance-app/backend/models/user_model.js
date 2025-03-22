const { DataTypes } = require('sequelize');// no need to import the whole sequelize object 
const sequelize= require('../config/db')

const USER= sequelize.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    created_at: {type: DataTypes.DATE, allowNull: false ,defaultValue: DataTypes.NOW },
    is_verified:{type: DataTypes.BOOLEAN,defaultValue: false,allowNull:true}
    
    },{underscored: true, timestamps: false, });
  
module.exports =USER