const express = require('express');
const router = express.Router();

module.exports = function(io) {
  router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
  });

  
  io.on('connection', socket => {
    console.log('Nuevo cliente conectado');
    
     socket.on('actualizarProductos', data => {
      
       io.emit('productosActualizados', data);
     });
  });

  return router;
};
