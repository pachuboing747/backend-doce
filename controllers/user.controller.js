const productManager = require('../dao/managers/user.manager.js')

const create = async (req, res) => {
    const { body } =  req
  
    const created = await manager.create(body)
  
    res.send(created)
}

module.exports = {
    create
}