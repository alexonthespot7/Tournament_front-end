import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
    return (Cookies.get('jwt') && Cookies.get('role') === 'ADMIN')
        ? children
        : <Navigate to='/' />;
}