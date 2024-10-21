import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import FormBuscarProducto from './FormBuscarProducto';
import Swal from 'sweetalert2';
import FormCantidadProducto from './FormCantidadProducto';

const NuevoPedido = () => {

    // extraer ID del cliente
    const {id} = useParams();
    const navigate = useNavigate();

    const [cliente, setCliente] = useState({});
    const [busqueda, setBusqueda] = useState('');
    const [productos, setGuardarProductos] = useState([]);
    const [total, setGuardarTotal] = useState(0);

    useEffect(() => {
        // obtener el cliente
        const consultarAPI = async() => {
            const resultado = await clienteAxios.get(`/clientes/${id}`);
            setCliente(resultado.data)
        }

        consultarAPI();

         // actualizar el total a pagar
        actualizarTotal();
    },[productos])

    const buscarProducto = async (e) => {
        e.preventDefault();

        // obtener los productos de la busqueda
        const resultadoBusqueda =  await clienteAxios.post(`/productos/busqueda/${busqueda}`);

        // si no hay resultados una alerta, de lo contrario agregarlo al state
        if(resultadoBusqueda.data[0]){
            let productoResultado = resultadoBusqueda.data[0];
            // agregar la llave "producto" (copia id)
            productoResultado.producto = resultadoBusqueda.data[0]._id;
            productoResultado.cantidad = 0;

            // ponerlo en el state
            setGuardarProductos([...productos, productoResultado]);
        }
        else {
            // no hay resultados
            Swal.fire({
                title: "No resultados",
                text: "No se encontraron resultados",
                icon: "error"
            });
        }
    }

    // almacena una busqueda en el state
    const leerDatosBusqueda = (e) => {
        setBusqueda(e.target.value);
    }

    // actualizar la cantidad de productos
    const restarProductos = (i) => {
        // copiar el arreglo original de los productos
        const todosProductos = [...productos];

        // validar si esta en 0 no puede ir mas alla
        if(todosProductos[i].cantidad === 0) return;

        // decremento
        todosProductos[i].cantidad--;

        // almacenarlo en el state
        setGuardarProductos(todosProductos);
    }

    const aumentarProductos = (i) => {
        // copiar el arreglo original de los productos
        const todosProductos = [...productos];

        // incremento
        todosProductos[i].cantidad++;
        
        //almacenarlo en el state
        setGuardarProductos(todosProductos);
    }

    // eliminar un producto del state
    const eliminarProductoPedido = async (id) => {
        const todosProductos = productos.filter(producto => producto.producto !== id);
        setGuardarProductos(todosProductos)
    }

    // actualizar el total a pagar
    const actualizarTotal = () => {
        // si el arreglo de productos es igual a 0: total es 0
        if(productos.length === 0){
            setGuardarTotal(0);
            return;
        }

        // calcular el nuevo total
        let nuevoTotal = 0;

        // recorrer todos los productos, sus cantidades y precios
        productos.map(producto => nuevoTotal += (producto.cantidad * producto.precio));
        setGuardarTotal(nuevoTotal);
    }

    // almacena el pedido en la base de datos
    const  realizarPedido = async (e) => {
        e.preventDefault();

        // construir el objeto
        const pedido = {
            "cliente": id,
            "pedido": productos,
            "total": total
        }
        
        // almacenarlo en la base de datos
        const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido);

        // leer resultado
        if(resultado.status === 200){
            Swal.fire({
                title: "Correcto",
                text: resultado.data.mensaje,
                icon: "success"
            });
        }
        else {
            Swal.fire({
                title: "Hubo un error!",
                text: "Vuelva a intentarlo",
                icon: "error"
            });
        }

        // Redireccionar
        navigate("/pedidos")
    }

    return (
        <>
            <h2>Nuevo Pedido</h2>

            <div className="ficha-cliente">
                <h3>Datos de Cliente</h3>
                <p>nombre: {cliente.nombre} {cliente.apellido}</p>
                <p>teléfono: {cliente.telefono}</p>
            </div>

            <FormBuscarProducto
                buscarProducto={buscarProducto}
                leerDatosBusqueda={leerDatosBusqueda}
            />
            
            <ul className="resumen">
                {
                    productos.map((producto, index) => (
                        <FormCantidadProducto
                            key={producto.producto}
                            producto={producto}
                            restarProductos={restarProductos}
                            aumentarProductos={aumentarProductos}
                            eliminarProductoPedido={eliminarProductoPedido}
                            index={index}
                        />
                    ))
                }
            </ul>
            <p className='total'>Total a pagara: <span>$ {total}</span></p>
            {
                total > 0 ? (
                    <form onSubmit={realizarPedido}>
                        <input 
                            type="submit"
                            className='btn btn-verde btn-block'
                            value="Realizar un pedido"
                        />
                    </form>
                ): null
            }
        </>
    )
}
export default NuevoPedido;