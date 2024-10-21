import React, { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import { CRMContext } from '../context/CRMContext';

const NuevoCliente = () => {

    // utlizar valores del context
    const [auth, setGuardarAuth] = useContext(CRMContext);

    const [cliente, setGuardarCliente] = useState({
        nombre: '',
        apellido: '',
        empresa: '',
        email: '',
        telefono: ''
    });

    const navigate = useNavigate();

    // leer datos del formulario
    const actualizarState = e => {
        // almacenar lo que el usuario escribe en el state (estado)
        setGuardarCliente({
            // obtener una copia del estado actual
            ...cliente,
            [e.target.name] : e.target.value
        })
    }

    // agrega en la REST API un nuevo cliente
    const agregarCliente = e => {
        e.preventDefault();

        // enviar la peticion
        clienteAxios.post('/clientes', cliente)
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
                        title: "Se agregó el cliente",
                        text: res.data.mensaje,
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

    // verificar si el usuario esta autenticado o no
    useEffect(() => {
        if (!auth.auth && (localStorage.getItem('token') === auth.token)) {
            navigate("/iniciar-sesion");
        }
    }, [auth, navigate]);

    return (
        <>
            <h2>Nuevo cliente</h2>
            <form onSubmit={agregarCliente}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Cliente" 
                        name="nombre"
                        onChange={actualizarState} 
                    />
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input 
                        type="text" 
                        placeholder="Apellido Cliente" 
                        name="apellido" 
                        onChange={actualizarState} 
                    />
                </div>
            
                <div className="campo">
                    <label>Empresa:</label>
                    <input 
                        type="text" 
                        placeholder="Empresa Cliente" 
                        name="empresa"
                        onChange={actualizarState}  
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        placeholder="Email Cliente" 
                        name="email" 
                        onChange={actualizarState} 
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input 
                        type="tel" 
                        placeholder="Telefono Cliente" 
                        name="telefono" 
                        onChange={actualizarState} 
                    />
                </div>

                <div className="enviar">
                        <input 
                            type="submit" 
                            className="btn btn-azul" 
                            value="Agregar Cliente"
                            disabled={ validarCliente() }
                        />
                </div>

            </form>
        </>
    )
}
export default NuevoCliente;