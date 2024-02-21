const express = require('express');
const router = express.Router();
const fs = require('fs');
const uuid = require('uuid');

const cartsFilePath = './data/carts.json';

// Crear un nuevo carrito
router.post('/', (req, res) => {
  const newCart = {
    id: uuid.v4(),
    products: []
  };
  fs.readFile(cartsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al crear el carrito');
    }
    const carts = JSON.parse(data);
    carts.push(newCart);
    fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al crear el carrito');
      }
      res.status(201).json(newCart);
    });
  });
});

// Obtener productos de un carrito por ID
router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  fs.readFile(cartsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al obtener el carrito');
    }
    const carts = JSON.parse(data);
    const cart = carts.find(cart => cart.id === cartId);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }
    res.json(cart.products);
  });
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1; // Si no se proporciona, agregar 1 por defecto
  fs.readFile(cartsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al agregar el producto al carrito');
    }
    let carts = JSON.parse(data);
    const cartIndex = carts.findIndex(cart => cart.id === cartId);
    if (cartIndex === -1) {
      return res.status(404).send('Carrito no encontrado');
    }
    const productIndex = carts[cartIndex].products.findIndex(product => product.id === productId);
    if (productIndex !== -1) {
      // Si el producto ya está en el carrito, aumentar la cantidad
      carts[cartIndex].products[productIndex].quantity += quantity;
    } else {
      // Si el producto no está en el carrito, agregarlo
      carts[cartIndex].products.push({ id: productId, quantity });
    }
    fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al agregar el producto al carrito');
      }
      res.status(201).send('Producto agregado al carrito');
    });
  });
});

module.exports = router;
