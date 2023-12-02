import Cookies from 'js-cookie';
import { Navigate, useParams } from 'react-router-dom';

export default function PersonalRoute({ children }) {
    const { id } = useParams();

    return (Cookies.get('jwt') && Cookies.get('userId') === id && id !== null)
        ? children
        : <Navigate to='/' />
}