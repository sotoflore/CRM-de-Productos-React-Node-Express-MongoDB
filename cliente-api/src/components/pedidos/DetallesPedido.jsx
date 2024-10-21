import React from 'react'
import Swal from 'sweetalert2';

const DetallesPedido = ({ pedido, eliminarPedido}) => {

    const { cliente } = pedido;

    const confirmarEliminacion = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarPedido(id);
                Swal.fire({
                    title:'¡Eliminado!',
                    text: "Pedido eliminado",
                    icon: "success"
                })
            }
        })
    };

    return (
        <li className="pedido">
            <div className="info-pedido">
                <p className="id">ID: {cliente._id}</p>
                <p className="nombre">Cliente: {cliente.nombre} {cliente.apellido}</p>
    
                <div className="articulos-pedido">
                    <p className="productos">Artículos Pedido: </p>
                    <ul>
                        {
                            pedido.pedido.map(articulos => (
                                <li key={pedido._id+articulos._id}>
                                    <p>nombre: {articulos.producto.nombre}</p>
                                    <p>precio: {articulos.producto.precio}</p>
                                    <p>cantidad: {articulos.cantidad}</p>
                                </li> 
                            ))
                        }                              
                    </ul>
                </div>
                <p className="total">Total: $ {pedido.total} </p>
            </div>
            <div className="acciones">
                <button 
                    type="button" 
                    className="btn btn-rojo btn-eliminar"
                    onClick={() => confirmarEliminacion(pedido._id)}
                >
                    <i className="fas fa-times" />
                    Eliminar Pedido
                </button>
            </div>
        </li>
    )
}
export default DetallesPedido;