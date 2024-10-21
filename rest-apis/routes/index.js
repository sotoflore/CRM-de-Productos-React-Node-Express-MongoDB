const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const productosController = require('../controllers/productosController');
const pedidosController = require('../controllers/pedidosController');
const usuariosController = require('../controllers/usuariosController');

// middleware para proteger las rutas
const auth = require('../middleware/auth');

module.exports = function(){

//------------------ CLIENTES ----------------

    // Agrega nuevo clientes via POST
    router.post('/clientes', clienteController.nuevoCliente);

    // obtener todos los clientes GET
    router.get('/clientes', 
        auth , 
        clienteController.mostrarClientes
    );

    // muestra un cliente en específico (ID)
    router.get('/clientes/:idCliente', 
        auth , 
        clienteController.mostrarCliente
    );

    // Actualizar cliente
    router.put('/clientes/:idCliente',
        auth , 
        clienteController.actualizarCliente
    );

    // Eliminar un cliente
    router.delete('/clientes/:idCliente', 
        auth , 
        clienteController.eliminarCliente
    )

//------------------------ PRODUCTOS -------------

    // nuevos productos
    router.post('/productos',
        auth , 
        productosController.subirArchivo, 
        productosController.nuevoProducto
    );

    // muestra todos los productos
    router.get('/productos',
        auth , 
        productosController.mostrarProductos
    );

    // muestra un producto en específico por su ID
    router.get('/productos/:idProducto',
        auth ,  
        productosController.mostrarProducto
    );

    // Actualizar productos
    router.put('/productos/:idProducto',
        auth ,  
        productosController.subirArchivo,
        productosController.actualizarProducto
    )

    // Eliminar Productos
    router.delete('/productos/:idProducto',
        auth ,  
        productosController.eliminarProducto
    );

    // busqueda de productos
    router.post('/productos/busqueda/:query',
        auth ,  
        productosController.buscarProducto
    );

//-------------------- PEDIDOS -----------

    // Agregar nuevos pedidos
    router.post('/pedidos/nuevo/:idUsuario',
        auth , 
        pedidosController.nuevoPedido
    )

    // mostrar todos los pedidos
    router.get('/pedidos', 
        auth , 
        pedidosController.mostrarPedidos
    )

    // mostrar un pedido por su ID
    router.get('/pedidos/:idPedido',
        auth ,  
        pedidosController.mostrarPedido
    );

    // actualizar pedidos
    router.put('/pedidos/:idPedido',
        auth ,  
        pedidosController.actualizarPedido
    );

    // Eliminar un pedido
    router.delete('/pedidos/:idPedido',
        auth ,  
        pedidosController.eliminarPedido
    );

//--------------USUARIOS--------------------------

    router.post('/crear-cuenta',
        auth , 
        usuariosController.registrarUsuario
    )
    router.post('/iniciar-sesion',
        usuariosController.AutenticarUsuario
    )

    return router;
}