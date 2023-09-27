const {Router} = require("express")
const MailSenderSvc = require ("../service/mail.sender.js")

const router = Router

router.get("/mail", (req, res)=>{

    MailSenderSvc.send("pachu1982721@gmail.com" , "hola")

    res.send("OKI")
})

module.exports = router