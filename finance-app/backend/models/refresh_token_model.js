const { DataTypes } = require('sequelize');
const sequelize= require('../config/db')
const User=require("./user_model")

const Refresh_Token=sequelize.define('refresh_tokens',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    token:{type:DataTypes.STRING,allowNull:false},
    expire_at: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},
{   timestamps: false
}
);
Refresh_Token.belongsTo(User,{
    foreignKey:"user_id",
    onDelete:'CASCADE'
})
module.exports=Refresh_Token