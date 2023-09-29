 const { Router } = require('express')
const mailSenderSvc = require('../../service/mail.sender.js')

const router = Router()

router.get('/mail', (req, res) => {
  const template = `

    <p>Tu pedido en la tienda<p>
    <br/>
    <ol>
      <li>Producto 1</li>
      <li>Producto 2</li>
    </ol>

    <p>Tiene status <span style="color: red">Incompleto</span></p>

  `
  mailSenderSvc.send('pachu1982721@gmail.com', template)

  res.send('OK')
})


module.exports = router