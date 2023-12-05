import { useContext } from 'react';

import { Button } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';

export default function ConfirmResults({ setLoading, fetchRoundsForm }) {

    const { makeErrorAlert, makeSuccessAlert, size, deleteCookies, checkResponseLength } = useContext(ContextWrapper);

    const navigate = useNavigate();

    const confirmResults = () => {
        if (window.confirm('Are you sure you want to confirm current stage results?')) {
            setLoading(true);
            fetchConfirmResults();
        }
    }

    const fetchConfirmResults = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/confirmresults`, {
                method: 'PUT',
                headers: {
                    'Authorization': Cookies.get('jwt')
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    deleteCookies();
                    navigate('/login');
                    makeErrorAlert('Your session has expired. Please login again');
                } else if (response.status === 406) {
                    checkResponseLength(response);
                } else if (response.status === 403) {
                    checkResponseLength(response);
                    navigate('/');
                } else {
                    checkResponseLength(response);
                }
            } else {
                fetchRoundsForm();
                makeSuccessAlert('Current stage results were successfully confirmed');
            }
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    return (
        <Button
            onClick={confirmResults}
            size={size}
            variant='contained'
            color='secondary'
        >
            Confirm results
        </Button>
    );
}