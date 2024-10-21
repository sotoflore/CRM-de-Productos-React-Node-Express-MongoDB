const Productos = require('../models/Productos');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const path = require('path');

const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, __dirname+'../../uploads/');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        }
        else {
            cb(new Error('Formato no válido'));
        }
    }
}

// pasar la configuracion y el campo
const upload = multer(configuracionMulter).single('imagen');

// sube el archivo
exports.subirArchivo = (req, res, next) => {
    upload(req, res, function(error){
        if(error) {
            res.json({mensaje: error})
        }
        return next();
    })
}


// agrega nuevo producto
exports.nuevoProducto = async(req, res, next) => {
    
    const producto = new Productos(req.body);

    try {

        if(req.file.filename){
            producto.imagen = req.file.filename;
        }
        
        await producto.save();
        res.json({mensaje: 'Se agregó un nuevo producto'});
    } catch (error) {
        console.log(error);
        next();
    }
}

// muestra todos los productos
exports.mostrarProductos = async(req, res, next) => {
    try {
        const productos = await Productos.find({});
        res.json(productos);
    } catch (error) {
        console.log(error);
        next();
    }
}

// muestra un producto en específico por su ID
exports.mostrarProducto = async(req, res, next) => {
    
    const producto = await Productos.findById(req.params.idProducto);

    if(!producto){
        res.json({mensaje : 'Ese producto no existe'});
        return next();
    }
    // mostrar el producto
    res.json(producto);
}

// actualiza un producto por su ID
exports.actualizarProducto = async(req, res, next) => {
    try {

        // construir un nuevo producto
        let nuevoProducto = req.body;

        // verificar si hay una imagen
        if(req.file){
            nuevoProducto.imagen = req.file.filename;
        }
        else {
            let productoAnterior = await Productos.findById(req.params.idProducto);
            nuevoProducto.imagen = productoAnterior.imagen;
        }

        let producto = await Productos.findOneAndUpdate({_id: req.params.idProducto},
            nuevoProducto, {
                new: true
            }
        )
        res.json(producto);
    } catch (error) {
        console.log(error);
        next();
    }
}

// eliminar producto por su ID
exports.eliminarProducto = async(req, res, next) => {
    try {
        await Productos.findByIdAndDelete({_id: req.params.idProducto});
        res.json({mensaje: 'El producto se ha eliminado'});
    } catch (error) {
        console.log(error);
        next();
    }
}

// busca un producto
exports.buscarProducto = async (req, res, next) => {
    try {
        // obtener el query
        const { query } = req.params;
        const producto = await Productos.find({ nombre: new RegExp(query, 'i')});
        res.json(producto);
        
    } catch (error) {
        console.log(error);
        next();
    }
}