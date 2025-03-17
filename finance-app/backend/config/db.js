const { Sequelize } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'mysql',  
  host:process.env.DB_HOST, //  ip adress
  username:process.env.DB_USER, 
  password:process.env.DB_PASS,
  database:process.env.DB_NAME,
  logging: process.env.NODE_ENV === 'development'   // Optional: Disable logging of SQL queries (for production)
});

module.exports=sequelize