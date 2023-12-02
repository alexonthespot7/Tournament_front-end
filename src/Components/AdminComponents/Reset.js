import { useContext } from 'react';

import { Button } from '@mui/material';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';
import { useNavigate } from 'react-router-dom';

export default function Reset({ buttonSx, setLoading, fetchUsersPageForm }) {

    const { makeErrorAlert, makeSuccessAlert, size, deleteCookies } = useContext(ContextWrapper);

    const navigate = useNavigate();

    const reset = () => {
        if (window.confirm('Are you sure you want to reset tournament progress?')) {
            setLoading(true);
            fetchReset();
        }
    }

    const fetchReset = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/reset`, {
                method: 'POST',
                headers: {
                    'Authorization': Cookies.get('jwt')
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    deleteCookies();
                    navigate('/login');
                    makeErrorAlert('Your session has expired. Please login again');
                } else if (response.status === 409) {
                    makeErrorAlert(await response.text());
                    fetchUsersPageForm();
                } else if (response.status === 403) {
                    makeErrorAlert(await response.text());
                    navigate('/');
                } else {
                    makeErrorAlert(await response.text());
                }
            } else {
                fetchUsersPageForm();
                makeSuccessAlert('You\'ve reset the tournament');
            }
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    return (
        <Button
            sx={buttonSx}
            size={size}
            variant='contained'
            color='error'
            onClick={reset}
        >
            Reset
        </Button>
    );
}