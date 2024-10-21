import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../layout/Spinner';

const EditarProducto = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [producto, setGuardarProducto] = useState({
        nombre: '',
        precio: '',
        imagen: ''
    });

    const [archivo, setGuardarArchivo] = useState('');

    useEffect(() => {
        // consultar la api para traer el producto a editar
        const consultarAPI = async () => {
            const productosConsulta = await clienteAxios.get(`/productos/${id}`);
            setGuardarProducto(productosConsulta.data);
        }

        consultarAPI();

    },[]);

    //edita un producto en la base de datos
    const editarProducto = async e => {
        e.preventDefault();

        // crear un form-data eso por la imagen
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);
        

        // almacenarlo en la base de datos
        try {
            const res = await clienteAxios.put(`/productos/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if(res.status === 200){
                Swal.fire({
                    title: "Editado correctamente",
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

    // extraer los valores del state
    const {nombre, precio, imagen} = producto;

    if(!nombre) return <Spinner/>

    return (
        <>
            <h2>Editar producto</h2>
            <form onSubmit={editarProducto}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Producto" 
                        name="nombre"
                        onChange={leerInformacionProducto}
                        defaultValue={nombre}
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
                        defaultValue={precio}
                    />
                </div>
            
                <div className="campo">
                    <label>Imagen:</label>
                        { imagen ? (
                            <img src={`http://localhost:5000/${imagen}`} alt="imagen" width="300" />
                            ) : null 
                        }
                    <input type="file" name="imagen" onChange={leerArchivo} />
                </div>

                <div className="enviar">
                        <input type="submit" className="btn btn-azul" value="Guardar Cambios" />
                </div>
            </form>
        </>
    )
}
export default EditarProducto;
