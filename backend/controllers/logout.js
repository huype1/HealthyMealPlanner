const logoutRouter = require('express').Router()
const { Session } = require("../models/")
const { tokenValidate } = require('../utils/middleware')

logoutRouter.delete('/', tokenValidate, async (req, res) => {
  try {
    await Session.destroy({
      where: { token: req.session.token },
    })
    res.status(204).json({ message: 'Log out successfully' }).end()
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'could not logout, try again' })
  }
  
})

module.exports = logoutRouter