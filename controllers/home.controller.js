const { Router } = require('express')
const path = require('path')
const productManager = require('../dao/managers/product.manager.js')
const cartsManager = require ("../dao/managers/cart.manager.js")


const getAllPaged = async (req, res) => {
    const { page = 1, size = 10 } = req.query
    const { docs: products, ...pageInfo } = await productManager.getAllPaged(page, size)
  
    pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&size=${size}` : ''
    pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&size=${size}` : ''
  
  
    req.session.homeCount = (req.session.homeCount || 0) + 1
  
    res.render('home', {
      title: 'Productos',
      products,
      pageInfo,
      user: req.user ?  {
        ...req.user,
        isAdmin: req.user?.role == 'admin',
      } : null,
      style: 'home'
    })
}

const chat = (req, res) => {
    res.render('chat', { 
        user: req.user ?  {
        ...req.user,
        isAdmin: req.user?.role == 'admin',
      } : null,
    })
}

const getAll = async (req, res) => {
 
    const products = await productManager.getAll()
   
    res.render('realTimeProducts', {
      title: 'Real Time',
      products,
      user: {
        ...req.user,
        isAdmin: req.user.role == 'admin',
      },
      style: 'home'
    })
}

const getAllProducts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
  
    const pageValue = parseInt(page);
    const limitValue = parseInt(limit);
  
    const { docs: products, ...pageInfo } = await productManager.getAllPaged(pageValue, limitValue);
  
    res.render("products", {
      title: "Productos",
      products,
      pageInfo,
      style: "products"
    });
}

const getById = async (req, res) => {
    try {
      const { productId, title, price, description, stock, thumbnail, code } = req.body;
      const userId = req.user.id;
  
      let cart = await cartsManager.getById(userId);
  
      if (!cart) {
        const newCart = await cartsManager.create({ user: userId });
        cart = newCart;
      }
  
      cart.products.push({
        productId,
        title,
        price,
        description,
        stock,
        thumbnail,
        code,
      });
  
      await cart.save();
  
      res.redirect("/carts");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al agregar el producto al carrito");
    }
}

const profile = (req, res) => {
    res.render('profile', {
      user: req.user ?  {
        ...req.user,
        isAdmin: req.user?.role == 'admin',
      } : null,
    })
}

const carts = async(req, res)=>{

    const carts = await cartsManager.getAll()
      res.render("carts", {
      title: "Carrito",
      carts,
      style: "carrito"
    })
}

module.exports = {
    getAllPaged,
    chat,
    getAll,
    getAllProducts,
    getById,
    profile,
    carts
}