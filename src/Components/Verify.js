import { useContext, useEffect } from 'react';

import { Box, CircularProgress } from '@mui/material';

import { useNavigate, useSearchParams } from 'react-router-dom';

import ContextWrapper from '../context/ContextWrapper';

export default function Verify() {
    const [searchParams, setSearchParams] = useSearchParams({});

    const { makeErrorAlert, makeSuccessAlert, deleteCookies, checkResponseLength } = useContext(ContextWrapper);

    const navigate = useNavigate();

    useEffect(() => {
        const code = searchParams.get('code')
        if (code) {
            const verificationCodeForm = { 'verificationCode': code };
            verifyUser(verificationCodeForm);
        } else {
            navigate('/');
        }
    }, []);

    const verifyUser = async (codeForm) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/verify`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(codeForm)
            });

            if (response.ok) {
                navigate('/login');
                makeSuccessAlert('Verification went well');
            } else if (response.status === 401) {
                deleteCookies();
                navigate('/login');
                makeErrorAlert('Your session has expired, please login again');
            } else {
                navigate('/');
                checkResponseLength(response);
            }
        } catch (error) {
            navigate('/');
            makeErrorAlert('Can\'t reach the server at the moment');
        }
    }


    return (
        <Box
            display='flex'
            width='90%'
            height='90%'
            alignItems='center'
            justifyContent='center'
        >
            <CircularProgress color='secondary' />
        </Box>
    );
}