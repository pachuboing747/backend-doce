const productModel = require ('../models/product.model')
const BaseManager = require ("./base.manager.js")

class ProductManager extends BaseManager  {

  constructor(){
    super(productModel)
  }

  getById(id) {
    return this.model.findOne({ _id: id })
  }

}

module.exports = new ProductManager() 
