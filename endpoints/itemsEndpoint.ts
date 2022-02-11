import express from 'express'
const router = express.Router()
const credentials = require('../middleware/credentials')
const { handleUserItems, updateItem } = require('../controllers/itemsController')

router.get('/items', credentials, (req, res) => {
  res.status(200).json({
    items: handleUserItems()
  })
})

router.post('/items', credentials, (req, res) => {
  const { id, name, role, email } = req.body

  if (!id || !name || !role || !email) {
    res.status(400).send('mandatory parameter is missing')
    return
  }

  updateItem({
    id,
    name,
    role,
    email,
    createdAt: new Date().toISOString()
  })

  res.status(200).send()
})

module.exports = router
