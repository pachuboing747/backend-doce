const { Router } = require('express')
const isAuth = require('../middlewares/auth')
const {
  getAllPaged,
  chat,
  getAll,
  getAllProducts,
  getById,
  profile,
  carts
} = require ("../controllers/home.controller.js")

const router = Router()


router.get('/', getAllPaged)

router.get('/chat', isAuth, chat)

router.get('/realtimesProducts', getAll)

router.get("/products", getAllProducts);

router.post("/products", isAuth, getById);

router.get('/profile', isAuth, profile)

router.get("/carts", carts)

module.exports = router