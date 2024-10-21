import React, { useContext, useState } from 'react'
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { CRMContext } from '../context/CRMContext';

const Login = () => {

    // auth y token
    const [auth, setGuardarAuth] = useContext(CRMContext)

    // state con los datos del formulario
    const [credenciales, setGuardarCredenciales] = useState({});
    const navigate = useNavigate();

    // inicia sesion en el servidor
    const iniciarSesion = async (e) => {
        e.preventDefault();

        // autenticar al usuario
        try {
            const respuesta = await clienteAxios.post('/iniciar-sesion', credenciales);

            // extraer el token y colocarlo en el localStorage
            const { token } = respuesta.data;
            localStorage.setItem('token', token);

            // colocarlo en el state
            setGuardarAuth({
                token, //token: token
                auth: true
            })

            Swal.fire({
                title: "Correcto",
                text: 'Has inicia Sesion correctamente',
                icon: "success"
                //showConfirmButton: false,
                //timer: 1000
            });
            // Redireccionar
            navigate("/")

        } catch (error) {
            //console.log(error);
            if (error.response) {
                Swal.fire({
                    title: "Hubo un error",
                    text: error.response.data.mensaje,
                    icon: "error"
                });
            }
            else {
                Swal.fire({
                    title: "Hubo un error",
                    text: "Hubo un error",
                    icon: "error"
                });
            }
        }
    }

    // almacenar lo que el usuario escibe en el state
    const leerDatos = (e) => {
        setGuardarCredenciales({
            ...credenciales,
            [e.target.name] : e.target.value
        })
    }
    return (
        <div className='login'>
            <h2>Iniciar Sesión</h2>
            <div className='contenedor-formulario'>
                <form onSubmit={iniciarSesion}>
                    <div className="campo">
                        <label>Email</label>
                        <input 
                            type="text"
                            name='email'
                            placeholder='Email para iniciar sesion'
                            onChange={leerDatos}
                        />
                    </div>
                    <div className="campo">
                        <label>Password</label>
                        <input 
                            type="password"
                            name='password'
                            placeholder='Password para iniciar sesion'
                            onChange={leerDatos} 
                        />
                    </div>
                    <input 
                        type="submit"
                        value="Iniciar Sesión"
                        className='btn btn-verde btn-block'
                    />
                </form>
            </div>
        </div>
    )
}
export default Login;