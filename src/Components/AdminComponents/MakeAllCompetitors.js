import { useContext } from 'react';

import { Button } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';

export default function MakeAllCompetitors({ buttonSx, setLoading, fetchUsersPageForm }) {
    const { makeErrorAlert, makeSuccessAlert, size, deleteCookies, checkResponseLength } = useContext(ContextWrapper);

    const navigate = useNavigate();

    const makeAllCompetitors = () => {
        if (window.confirm('Are you sure you want to make all users competitors?')) {
            setLoading(true);
            fetchMakeAllCompetitors();
        }
    }

    const fetchMakeAllCompetitors = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/makeallcompetitors`, {
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
                    fetchUsersPageForm();
                } else if (response.status === 403) {
                    checkResponseLength(response);
                    navigate('/');
                } else {
                    checkResponseLength(response);
                }
            } else {
                fetchUsersPageForm();
                makeSuccessAlert('You\'ve made all verified users competitors');
            }
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    return (
        <Button
            sx={buttonSx}
            size={size}
            variant='outlined'
            color='secondary'
            onClick={makeAllCompetitors}
        >
            Make all competitors
        </Button>
    );
}