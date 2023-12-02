import Cookies from 'js-cookie';
import { Navigate, useLocation } from 'react-router-dom';

export default function PublicRoute({ children }) {
    const location = useLocation();
    const url = new URLSearchParams(location.search.slice(1));

    return Cookies.get('jwt') ? <Navigate to={url.get('redirect') || '/'} /> : children;
}