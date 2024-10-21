import React, { useContext } from 'react';
import { CRMContext } from '../context/CRMContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();

    const [auth, setGuardarAuth] = useContext(CRMContext);

    const cerrarSesion = () => {
        // auth.auth = false y el token se remueve
        setGuardarAuth({
            token: '',
            auth: false
        });

        localStorage.setItem('token', '');

        // Redireccionar
        navigate("/iniciar-sesion")
    }

    return (
        <header className="barra">
            <div className="contenedor">
                <div className="contenido-barra">
                    <h1>CRM - Administrador de Clientes</h1>
                    {
                        auth.auth ? (
                            <button
                                type='button'
                                className='btn btn-rojo'
                                onClick={cerrarSesion}
                            >
                                cerrar sesion
                            </button>
                        ): null
                    }
                </div>
            </div>
        </header>
    )
}
export default Header;