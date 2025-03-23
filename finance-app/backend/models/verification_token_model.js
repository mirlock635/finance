const sequelize=require("../config/db")
const { DataTypes } = require('sequelize');
const User=require("../models/user_model")

const Verification_token=sequelize.define("verification_tokens",{
id:{type:DataTypes.STRING,primaryKey:true,autoIncrement:true},
token:{type:DataTypes.STRING,allowNull:false},
expires_at : {type: DataTypes.BIGINT,allowNull: false},
user_id: {type: DataTypes.INTEGER,allowNull: false}
},
{underscored: true, timestamps: false, })  

Verification_token.belongsTo(User,{
    foreignKey:"user_id",
    onDelete:'CASCADE'
})

module.exports=Verification_token