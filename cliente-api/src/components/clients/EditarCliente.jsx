import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import clienteAxios from '../../config/axios';

const EditarCliente = () => {

    const [cliente, setDatosCliente] = useState({
        nombre: '',
        apellido: '',
        empresa: '',
        email: '',
        telefono: ''
    });
    
    const { id } = useParams();

    const navigate = useNavigate();

    // Query a la APY
    const consultarAPI = async () => {
        const clientesConsulta = await clienteAxios.get(`/clientes/${id}`);

        // colocar en el state
        setDatosCliente(clientesConsulta.data);
    }

    // useEffect, cuando el componente se carga
    useEffect(() => {
        consultarAPI();
    }, [])

    // leer datos del formulario
    const actualizarState = e => {
        // almacenar lo que el usuario escribe en el state (estado)
        setDatosCliente({
            // obtener una copia del estado actual
            ...cliente,
            [e.target.name] : e.target.value
        })
    }

    // Envia una peticion por axios para actualizar el cliente
    const actualizarCliente = e => {
        e.preventDefault();

        // enviar peticion por axios
        clienteAxios.put(`/clientes/${cliente._id}`, cliente)
        .then(res => {
            // validar si hay errores de mongoBD
               if(res.data.code === 11000){
                    Swal.fire({
                        title: "Hubo un error",
                        text: "Ese cliente ya esta registrado",
                        icon: "error"
                    });
               }
               else{
                    Swal.fire({
                        title: "Correcto",
                        text: "Se actualizó correctamente",
                        icon: "success"
                    });
               }

               // Redireccionar
               navigate("/");
        })
    }

    // validar el formulario
    const validarCliente = () => {

        const {nombre, apellido, email, empresa, telefono} = cliente;

        // revisar que las propiedades del state tengan contenido
        let valido = !nombre.length || !apellido.length || !email.length || !empresa.length || !telefono.length;

        // retorna true o false
        return valido;
    }

    return (
        <>
            <h2>Editar cliente</h2>
            <form onSubmit={actualizarCliente}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Cliente" 
                        name="nombre"
                        onChange={actualizarState} 
                        value={cliente.nombre}
                    />
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input 
                        type="text" 
                        placeholder="Apellido Cliente" 
                        name="apellido" 
                        onChange={actualizarState}
                        value={cliente.apellido}
                    />
                </div>
            
                <div className="campo">
                    <label>Empresa:</label>
                    <input 
                        type="text" 
                        placeholder="Empresa Cliente" 
                        name="empresa"
                        onChange={actualizarState}
                        value={cliente.empresa}  
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        placeholder="Email Cliente" 
                        name="email" 
                        onChange={actualizarState}
                        value={cliente.email}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input 
                        type="tel" 
                        placeholder="Telefono Cliente" 
                        name="telefono" 
                        onChange={actualizarState}
                        value={cliente.telefono}
                    />
                </div>

                <div className="enviar">
                    <input 
                        type="submit" 
                        className="btn btn-azul" 
                        value="Guardar cambios"
                        disabled={ validarCliente() }
                    />
                </div>

            </form>
        </>
    )
}
export default EditarCliente;