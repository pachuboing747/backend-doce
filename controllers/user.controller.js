const userManager = require('../dao/managers/user.manager.js')

const create = async (req, res) => {
    const { body } =  req
  
    const created = await userManager.create(body)
  
    res.send(created)
}

module.exports = {
    create
}