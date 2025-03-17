const Sequelize = require('sequelize');
const sequelize= require('../config/db') //
const User=require("./user_model")

const Reset_Token=sequelize.define('reset_tokens',{
    id:{type:Sequelize.INTEGER,primaryKey:true,autoIncrement:true},
    token:{type:Sequelize.STRING,allowNull:false},
    expires_at : {
        type: Sequelize.BIGINT,
        allowNull: false,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
},
{underscored: true, timestamps: false, }
);
Reset_Token.belongsTo(User,{
    foreignKey:"user_id",
    onDelete:'CASCADE'
})
module.exports=Reset_Token