import { useContext } from 'react';

import { IconButton } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

import { useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';

export default function DeleteUser({ userId, setLoading, fetchUsersPageForm }) {

    const { makeErrorAlert, makeSuccessAlert, size, deleteCookies, checkResponseLength } = useContext(ContextWrapper);

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
                    checkResponseLength(response);
                    navigate('/');
                } else if ([400, 409].includes(response.status)) {
                    checkResponseLength(response);
                    setLoading(false);
                } else {
                    checkResponseLength(response);
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