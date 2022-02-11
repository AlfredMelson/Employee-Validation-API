import { Router } from 'express'
const authentication = require('../middleware/authentication')
const { handleUserItems, updateItem } = require('../controllers/itemsController')

const router = Router()

router.get('/items', authentication, (req, res) => {
  res.status(200).json({
    items: handleUserItems()
  })
})

router.post('/items', authentication, (req, res) => {
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
    createdAt: new Date().toDateString()
  })

  res.status(200).send()
})

export default router
