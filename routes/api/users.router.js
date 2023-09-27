const { Router } = require('express')
const {
  create
} = require ("../../controllers/user.controller.js")

const router = Router()

router.post('/', create)

module.exports = router
