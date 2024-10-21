import React, { useEffect, useState } from 'react'
import clienteAxios from '../../config/axios';
import DetallesPedido from './DetallesPedido';

const Pedidos = () => {

    const [pedidos, setPedidos] = useState([]);
    
    useEffect(() => {
        const consultarAPI = async () => {
            // obtener los pedidos
            const resultado = await clienteAxios.get('/pedidos');
            setPedidos(resultado.data);
        }

        consultarAPI();

    }, [])

    // eliminar un pedido
    const eliminarPedido =  async (id) => {
        try {
            await  clienteAxios.delete(`/pedidos/${id}`);
            setPedidos(pedidos.filter(pedido => pedido._id !== id));
        } catch (error) {
            console.error("Error al eliminar el pedido", error);
        }
    }

    return (
        <>
            <h2>Pedidos</h2>

            <ul className="listado-pedidos">
                {
                    pedidos.map(pedido => (
                        <DetallesPedido
                            key={pedido._id}
                            pedido={pedido}
                            eliminarPedido={eliminarPedido}
                        />
                    ))
                }
            </ul>
        </>
    )
}
export default Pedidos;