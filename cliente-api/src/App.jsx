import { useContext } from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from "./components/layout/Header";
import Navegacion from "./components/layout/Navegacion";
import Clientes from './components/clients/Clientes';
import Productos from './components/productos/Productos';
import Pedidos from './components/pedidos/Pedidos';
import NuevoCliente from './components/clients/NuevoCliente';
import EditarCliente from './components/clients/EditarCliente';
import NuevoProducto from './components/productos/NuevoProducto';
import EditarProducto from './components/productos/EditarProducto';
import NuevoPedido from './components/pedidos/NuevoPedido';
import Login from './components/auth/Login';
import { CRMContext, CRMProvider } from './components/context/CRMContext';

const App = () => {

    // utilizar context en el componente
    const [auth, setGuardarAuth] = useContext(CRMContext);

    return (
        <Router>
            <CRMProvider value={[auth, setGuardarAuth]}>
            <Header/>
            <div className="grid contenedor contenido-principal">
                <Navegacion/>
                <main className="caja-contenido col-9">
                    <Routes>
                        <Route path='/' element={<Clientes />} />
                        <Route path='/clientes/nuevo' element={<NuevoCliente />} />
                        <Route path='/clientes/editar/:id' element={<EditarCliente />} />

                        <Route path='/productos' element={<Productos />} />
                        <Route path='/productos/nuevo' element={<NuevoProducto />} />
                        <Route path='/productos/editar/:id' element={<EditarProducto />} />

                        <Route path='/pedidos' element={<Pedidos />} />
                        <Route path='/pedidos/nuevo/:id' element={<NuevoPedido />} />

                        <Route path='/iniciar-sesion' element={<Login />} />
                    </Routes>
                </main>
            </div>
            </CRMProvider>
        </Router>
    )
}
export default App;