import { useContext, useState } from 'react';

import { Box, Button, CircularProgress, IconButton, InputAdornment, OutlinedInput, TextField, Typography } from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';
import ForgotPassword from './ForgotPassword';

const initialCredentials = {
    username: '',
    password: ''
}

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState(initialCredentials);
    const [showPassword, setShowPassword] = useState(false);

    const {
        windowSize, makeErrorAlert, makeBlackAlert,
        makeSuccessAlert, headerVariant, size,
        checkResponseLength
    } = useContext(ContextWrapper);

    const navigate = useNavigate();

    const coefficient = 1000000;
    const baseWidthPercentage = 18;

    // The size variables for responsiveness of the page
    const boxWidthPercentage = `${coefficient / Math.pow(windowSize.width, 1.7) + baseWidthPercentage}%`;

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const inputChanged = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    }

    const login = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                const jwtToken = response.headers.get('Authorization');
                const role = response.headers.get('Allow');
                const authUserId = response.headers.get('Host');
                const authUsername = response.headers.get('Origin');

                Cookies.set('jwt', jwtToken, { expires: 1 }); //expires in 1 day as it is in back-end;
                Cookies.set('role', role, { expires: 1 });
                Cookies.set('userId', authUserId, { expires: 1 });
                Cookies.set('username', authUsername, { expires: 1 });
                setCredentials(initialCredentials);

                setLoading(false);
                navigate('/');
                makeSuccessAlert('Login process was successful');
            } else {
                setLoading(false);
                checkResponseLength(response);
            }
        } catch (error) {
            makeErrorAlert('Can\'t reach the server at the moment');
        }
    }

    const performLogin = () => {
        if (credentials.username === '') {
            makeBlackAlert('Please provide username or email');
        } else if (credentials.password === '') {
            makeBlackAlert('Please provide password');
        } else {
            setLoading(true);
            login();
        }
    }

    return (
        <Box
            sx={{ mt: '5%' }}
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            height='100%'
            width='100%'
        >
            <Typography variant={headerVariant} sx={{ mb: '1.5%' }}>
                Login
            </Typography>
            {!loading &&
                <Box
                    display='flex'
                    flexDirection='column'
                    gap={windowSize.height / 400}
                    width={boxWidthPercentage}
                    sx={{ textAlign: 'start' }}
                >
                    <Typography>Username:</Typography>
                    <TextField
                        size={size}
                        color='secondary'
                        variant='outlined'
                        placeholder='Username'
                        name='username'
                        value={credentials.username}
                        onChange={inputChanged}
                    />
                    <Typography>Password:</Typography>
                    <OutlinedInput
                        size={size}
                        color='secondary'
                        sx={{ mb: '6%' }}
                        placeholder='Password'
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position='end'>
                                <IconButton
                                    aria-label='toggle password visibility'
                                    onClick={handleClickShowPassword}
                                    edge='end'
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        name='password'
                        value={credentials.password}
                        onChange={inputChanged}
                    />
                    <Button
                        size={size}
                        variant='contained'
                        color='secondary'
                        onClick={performLogin}
                        sx={{
                            transition: '0.35s',
                            '&:hover': { backgroundColor: '#555555' }
                        }}
                    >
                        Login
                    </Button>
                    <Box
                        display='flex'
                        justifyContent='space-between'
                    >
                        <Button
                            onClick={() => navigate('/signup')}
                            size={size}
                            variant='text'
                            color='secondary'
                        >
                            Sign Up
                        </Button>
                        <ForgotPassword />
                    </Box>
                </Box>
            }
            {loading && <CircularProgress color='secondary' />}
        </Box>
    );
}