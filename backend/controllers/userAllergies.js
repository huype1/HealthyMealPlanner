const router = require('express').Router()

const { UserAllergy } = require('../models')

// router.post('/', async (req, res) => {
//   try {
//     const user = await UserAllergy.create(req.body)
//     res.json(user)
//   } catch(error) {
//     return res.status(400).json({ error })
//   }
// })

// router.get('/:id', async (req, res) => {
//   const user = await User.findByPk(req.params.id)
//   if (user) {
//     res.json(user)
//   } else {
//     res.status(404).end()
//   }
// })

module.exports = router