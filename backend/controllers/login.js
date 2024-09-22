const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const { SECRET } = require('../utils/config')
const User = require('../models/user')

router.post('/', async (req, res) => {
  const body = req.body
  const user = await User.findOne({
    where: {
      userName: req.body.userName
    }
  })

  const passwordCorrect = await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    userName: user.userName,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET, { expiresIn: 60*60*24 })

  res
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router