require("dotenv").config({ path: '.env' })
const PORT = process.env.PORT || 3001

module.exports = {
  DATABASE: process.env.DATABASE,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  HOST: process.env.HOST,
  DB_PORT: process.env.DB_PORT,
  PORT,
  SECRET: process.env.SECRET,
}