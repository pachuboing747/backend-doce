(async () => {
  const dotenv = require ("dotenv")
  dotenv.config()

  const http = require('http')
  const path = require('path')

  const express = require('express')
  const handlebars = require('express-handlebars')
  const { Server } = require("socket.io");
  const mongoose = require('mongoose')
  const cookieParser = require('cookie-parser')
  const session = require('express-session')
  const MongoStore = require('connect-mongo')
  const passport = require('passport')

  const config = require ("./config/config.js")
  const Routes = require('./routes/index.js')
  const socketManager = require('./websocket/index.js')
  const initPassport = require('./config/passport.init.js')

 

  const cartRouter = require("./routes/carts.router.js")

  console.log(config)

  try {

    await mongoose.connect(config.MONGO_URL)

    const app = express() 
    const server = http.createServer(app)
    const io = new Server(server) 


    app.engine('handlebars', handlebars.engine())
    app.set('views', path.join(__dirname, '/views'))
    app.set('view engine', 'handlebars')

    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use('/static', express.static(path.join(__dirname + '/public')))
    app.use(cookieParser('esunsecreto'))
    
    app.use(session({
      secret: 'esunsecreto',
      resave: true,
      saveUninitialized: true,

      store: MongoStore.create({
        mongoUrl: "mongodb+srv://pachu1982721:VPXombCDAVDvOaVQ@cluster0.lvefot0.mongodb.net/ecommerce?retryWrites=true&w=majority",
        ttl: 60 * 60
      })
    }))

    initPassport()
    
    app.use(passport.initialize())
    app.use(passport.session())
    

    app.use((req, res, next) => {

      console.log(req.session, req.user)
      next()
    })

    app.use('/', Routes.home)
    app.use('/api', (req, res, next) => {
      req.io = io
      next()
    }, Routes.api, cartRouter)

    app.use((err, req, res, next) => {
      console.log()
      console.log()
    
      res.send({
        success: false,
        error: err.stack
      })
    })

    io.on('connection', socketManager)

    const port = 8080

    server.listen(port, () => {
      console.log(`Express Server listening at http://localhost:${port}`)
    })

    console.log('se ha conectado a la base de datos')
  } catch(e) {
    console.log('no se ha podido conectar a la base de datos')
  }
})()

 