import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

export default function AuthRoute({ children }) {
    return (Cookies.get('jwt')) ? children : <Navigate to='/' />;
}