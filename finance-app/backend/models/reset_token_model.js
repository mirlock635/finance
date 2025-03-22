const { DataTypes } = require('sequelize');// no need to import the whole sequelize object 
const sequelize= require('../config/db') 
const User=require("./user_model")

const Reset_Token=sequelize.define('reset_tokens',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    token:{type:DataTypes.STRING,allowNull:false},
    expires_at : {type: DataTypes.BIGINT,allowNull: false,},
    user_id: {type: DataTypes.INTEGER,allowNull: false,}
},
{underscored: true, timestamps: false, }
);
Reset_Token.belongsTo(User,{
    foreignKey:"user_id",
    onDelete:'CASCADE'
})
module.exports=Reset_Token