import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import Producto from './Producto';
import Spinner from '../layout/Spinner';
import { CRMContext } from '../context/CRMContext';

const Productos = () => {

    const [productos, setProductos] = useState([]);

    // utlizar valores del context
    const [auth, setGuardarAuth] = useContext(CRMContext)
    const navigate  = useNavigate();

    // useEffect para consultar la API
    useEffect(() => {
        if(auth.token !== ''){
            // query a la API
            const consultarAPI= async () =>{
                try {
                    const productosConsulta = await clienteAxios.get('/productos',{
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });
                setProductos(productosConsulta.data)
                } catch (error) {
                    //Error con Authorizacion
                    if(error.response.status = 500){
                        navigate("/iniciar-sesion");
                    }
                }
            }
            consultarAPI();
        }
        else {
            navigate("/iniciar-sesion");
        }
    }, [productos])

    // si el state esta como false
    if(!auth.auth){
        navigate("/iniciar-sesion");
    }

    // Spinner de carga
    if(!productos.length) return <Spinner/>

    return (
        <>
            <h2>Productos</h2>
            <Link to="/productos/nuevo" className='btn btn-verde nvo-cliente'>Nuevo producto</Link>
            <ul className="listado-productos">
               {
                    productos.map(producto => (
                        <Producto
                            key={producto._id}
                            producto={producto}
                        />
                    ))
               } 
            </ul>
        </>
    )
}
export default Productos;