'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports={
  async  up(queryInteface,Sequelize){
    await queryInteface.createTable("users",{
      id: {type: Sequelize.INTEGER,
        allowNull:false,primaryKey:true,autoIncrement:true},
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    },{ timestamps: false} 
    )
  }
  ,
  async down(queryInteface,Sequelize){
    await queryInteface.dropTable("users")  }
}
