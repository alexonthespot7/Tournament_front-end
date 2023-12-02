import { IconButton } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import { useContext } from 'react';
import ContextWrapper from '../../context/ContextWrapper';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function DeleteUser({ userId, setLoading, fetchUsersPageForm }) {

    const { makeErrorAlert, makeSuccessAlert, size, deleteCookies } = useContext(ContextWrapper);

    const navigate = useNavigate();

    const deleteUser = () => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setLoading(true);
            fetchDeleteUser();
        }
    }

    const fetchDeleteUser = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/deleteuser/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': Cookies.get('jwt')
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    deleteCookies();
                    navigate('/login');
                    makeErrorAlert('Your session has expired. Please login again');
                } else if (response.status === 403) {
                    makeErrorAlert(await response.text());
                    navigate('/');
                } else if ([400, 409].includes(response.status)) {
                    makeErrorAlert(await response.text());
                    setLoading(false);
                } else {
                    makeErrorAlert(await response.text());
                }
            } else {
                fetchUsersPageForm();
                makeSuccessAlert('You\'ve deleted the user successfully');
            }
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    return (
        <IconButton onClick={deleteUser} size={size}>
            <DeleteIcon fontSize={size} color='error' />
        </IconButton>
    );
}