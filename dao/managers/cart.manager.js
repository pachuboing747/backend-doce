const cartModel = require("../../dao/models/cart.model");
const BaseManager = require ("./base.manager.js")


class CartsManager extends BaseManager {

  constructor(){
    super(cartModel)
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await this.model.findById(cartId);

      if (!cart) {
        return null;
      }

      const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

      if (productIndex === -1) {
        return null; 
      }

      cart.products[productIndex].qty = newQuantity;
      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }
  
  async getPopulate(id) {
    try {
      const cart = await this.model.findById(id).populate("products.product");
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      return null;
    }
  }
}


module.exports = new CartsManager ();

