const { Sequelize } = require('sequelize');
const { DATABASE, USER, PASSWORD, HOST, DB_PORT } = require('./config')
// const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  dialect: 'postgres',
  host: HOST,
  port: DB_PORT,
  logging: false,
  dialectOptions: {
    ssl: false,
    clientMinMessages: 'ignore',
  },

});



async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // await runMigrations();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return process.exit(1)
  }
  return null
}
module.exports = {
  sequelize, connectToDatabase
}