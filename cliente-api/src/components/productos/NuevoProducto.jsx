import React, { useState } from 'react'
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { useNavigate } from 'react-router-dom';

const NuevoProducto = () => {

    const [producto, setGuardarProducto] = useState({
        nombre: '',
        precio: '',
    });

    const [archivo, setGuardarArchivo] = useState('');
    
    const navigate = useNavigate();

    //almacena el nuevo producto en la base de datos
    const agregarProducto = async (e) => {
        e.preventDefault();

        // crear un form-data eso por la imagen
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);

        // almacenarlo en la base de datos
        try {
            const res = await clienteAxios.post('/productos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if(res.status === 200){
                Swal.fire({
                    title: "Agregado correctamente",
                    text: res.data.mensaje,
                    icon: "success"
                })
            }

            // redireccionar
            navigate("/productos");

        } catch (error) {
            console.log(error)
            Swal.fire({
                title: "Hubo un error",
                text: "Vuelva a intentarlo",
                icon: "error"
            })
        }
    }

    // leer los datos del formulario
    const leerInformacionProducto = e => {
        setGuardarProducto({
            // obtener una copia del state y agregar el nuevo
            ...producto,
            [e.target.name] : e.target.value
        })
    }

    // coloca la imagen en el state
    const leerArchivo = e => {
        setGuardarArchivo(e.target.files[0])
    }

    return (
        <>
            <h2>Nuevo producto</h2>
            <form onSubmit={agregarProducto}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Producto" 
                        name="nombre"
                        onChange={leerInformacionProducto}
                    />
                </div>

                <div className="campo">
                    <label>Precio:</label>
                    <input 
                        type="number" 
                        name="precio" 
                        min="0.00" 
                        step="0.01" 
                        placeholder="Precio"
                        onChange={leerInformacionProducto} 
                    />
                </div>
            
                <div className="campo">
                    <label>Imagen:</label>
                    <input 
                        type="file" 
                        name="imagen"
                        onChange={leerArchivo} 
                    />
                </div>

                <div className="enviar">
                        <input type="submit" className="btn btn-azul" value="Agregar Producto" />
                </div>
            </form>
        </>
    )
}
export default NuevoProducto;