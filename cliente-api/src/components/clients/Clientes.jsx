import React, { useContext, useEffect, useState } from 'react';

// importar cliente axios
import clienteAxios from '../../config/axios';
import Cliente from './Cliente';
import { Link, useNavigate} from 'react-router-dom';
import Spinner from '../layout/Spinner';
import { CRMContext } from '../context/CRMContext';

const Clientes = () => {

    const [clientes, setClientes] = useState([]);
    
    // utlizar valores del context
    const [auth, setGuardarAuth] = useContext(CRMContext)

    const navigate  = useNavigate();

    useEffect(() => {
        if(auth.token !== ''){
             //  query a la API
            const consultarAPI = async () => {
                try {
                    const clientesConsulta = await clienteAxios.get('/clientes', {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });
                    // guardarlo el resultado en el state
                    setClientes(clientesConsulta.data);
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
    }, [auth]);

    // si el state esta como false
    if(!auth.auth){
        navigate("/iniciar-sesion");
    }


    if(!clientes.length) return <Spinner/>

    return (
        <>
            <h2>Clientes</h2>
            <Link to="/clientes/nuevo" className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle" />
                Nuevo Cliente
            </Link>
            <ul className='listado-clientes'>
                {
                    clientes.map(cliente =>(
                        <Cliente
                            key={cliente._id}
                            cliente={cliente}
                        />
                    )) 
                }
            </ul>
        </>
    )
}
export default Clientes;