const cartsManager = require('../dao/managers/cart.manager.js')
const productManager = require('../dao/managers/product.manager.js')
const CartModel = require ("../dao/models/cart.model.js")


const getAll = async (req, res) => {

    const { search, max, min, limit } = req.query;
    const carts = await cartsManager.getAll();
  
    let filtrados = carts;
  
    if (search) {
      filtrados = filtrados.filter(
        (p) =>
          p.keywords.includes(search.toLowerCase()) ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    if (min || max) {
      filtrados = filtrados.filter(
        (p) => p.price >= (+min || 0) && p.price <= (+max || Infinity)
      );
    }
  
    res.send(filtrados);
}

const populate = async (req, res) => {
    try {
      const id = req.params.cid;
      const cart = await cartsManager.getPopulate(id);
  
      if (!cart) {
        res.status(404).send("No se encuentra un carrito de compras con el identificador proporcionado");
      } else if (cart.products.length === 0) {
        res.status(201).send("Este carrito no contiene productos seleccionados");
      } else {
        res.status(201).send(cart);
      }
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).send("Ocurrió un error al obtener el carrito");
    }
}

const create = async (req, res) => {
    const { body, io } = req;
  
    try {
      const cart = new CartModel({
        products: [
          {
            product: body.productId,
            qty: 1,
            title: body.title,
            description: body.description,
            price: body.price,
            thumbnail: body.thumbnail,
            code: body.code,
            stock: body.stock,
          },
        ],
      });
  
      const savedCart = await cart.save();
      io.emit("newProduct", savedCart);
  
      res.status(201).send(savedCart);
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      res.status(500).send("Ocurrió un error al crear el carrito");
    }
}

const deleteId = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await cartsManager.delete(id);
  
      if (result) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.sendStatus(500);
    }
}

const deleteProducts = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const cart = await cartsManager.getById(cid);
  
      if (!cart) {
        return res.status(404).send("No se encuentra un carrito de compras con el identificador proporcionado");
      }
  
      const productIndex = cart.products.findIndex(product => product.id === pid);
  
      if (productIndex === -1) {
        return res.status(404).send("Producto no encontrado en el carrito");
      }
  
      cart.products.splice(productIndex, 1);
  
      await cart.save();
  
      res.status(200).send("Producto eliminado del carrito exitosamente");
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      res.status(500).send("Ocurrió un error al eliminar el producto del carrito");
    }
}

const getById = async (req, res) => {
    try {
      const { cid } = req.params;
      const { products } = req.body;
  
      const cart = await cartsManager.getById(cid);
      if (!cart) {
        return res.status(404).send("No se encuentra un carrito de compras con el identificador proporcionado");
      }
  
      cart.products = products;
  
      const updatedCart = await cart.save();
  
      res.status(200).json(updatedCart);
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      res.status(500).send("Ocurrió un error al actualizar el carrito");
    }
}

const findById = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const { qty } = req.body;
  
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }
  
      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === productId
      );
  
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
      }
  
      cart.products[productIndex].qty = qty;
      await cart.save();
  
      return res.status(200).json({ message: 'Cantidad de producto actualizada en el carrito' });
    } catch (error) {
      console.error('Error al actualizar la cantidad de producto en el carrito:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  
}

const deleteAll = async (req, res) => {
    const { cid } = req.params;
  
    try {
      const result = await cartsManager.deleteAll(cid);
  
      if (result) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error("Error al eliminar los productos del carrito:", error);
      res.sendStatus(500);
    }
}

const purchase = async (req, res) => {
  const { cartId } = req.params

  /// TODO
  // ejecutar un metodo en el repository o service para crear la orden de compra
  // envio al cliente un 201 HTTP ACCEPTED o 400 o 500
  // cartManager.getById()
  // purchaseOrderManager.create()

  const cart = await cartsManager.getById(cartId)

  if (!cart) {
    return res.sendStatus(404)
  }

  const { products: productsInCart } = cart
  const products = [] // dto
  // {
    // price,
    // id
    // qty
  // }
  // const productsToDelete = []
  
  for (const { product: id, qty } of productsInCart) {
    // chequear el stock
    // 1. si el qty <= stock entonces agrego el producto al array y lo elimino del carro
    // 2. actualizo el stock


    const p = await productManager.getById(id)

    // stock: 5, qty: 1 => 1 y -1
    // stock: 5, qty: 5 => 5 y -5
    // stock: 5, qty: 6, 6 y -5
    // stock: 0, qty: 1, 0 y 0

    if (!p.stock) {
      return
    }

    const toBuy = p.stock >= qty ? qty : p.stock

    products.push({
      id: p._id,
      price: p.price,
      qty: toBuy
    })

    //
    
    /// actualizar el stock
    p.stock = p.stock - toBuy

    await p.save()

    // actualizo el carrito
    // TODO
  }


  const po = {
    user: null,
    products: products.map(({ id, qty}) =>  {
      return {
        product: id,
        qty,
        code: null,
        total: products.reduce((total, { price, qty}) => (price * qty) + total, 0), 
      }
    })
  }

  console.log(po)


  res.send(po)
};


module.exports = {
    getAll,
    populate,
    create,
    deleteId,
    deleteProducts,
    getById,
    findById,
    deleteAll,
    purchase
}