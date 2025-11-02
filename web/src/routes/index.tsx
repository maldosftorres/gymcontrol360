import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import DashboardLayout from '../pages/DashboardLayout';
import Home from '../pages/Home';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import { Usuarios } from '../pages/Usuarios';
import { MembresiasPage } from '../pages/Membresias/MembresiasPage';
import { PagosPage } from '../pages/Pagos/PagosPage';
import { CajaPage } from '../pages/Caja/CajaPage';
import SedesPage from '../pages/SedesPage';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'usuarios',
        element: <Usuarios />,
      },
      {
        path: 'sedes',
        element: <SedesPage />,
      },
      {
        path: 'membresias',
        element: <MembresiasPage />,
      },
      {
        path: 'pagos',
        element: <PagosPage />,
      },
      {
        path: 'caja',
        element: <CajaPage />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);