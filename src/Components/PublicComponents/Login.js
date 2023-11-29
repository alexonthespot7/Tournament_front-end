import { useContext, useState } from 'react';

import { Box, Button, CircularProgress, IconButton, InputAdornment, OutlinedInput, TextField, Typography } from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';

const initialCredentials = {
    username: '',
    password: ''
}

const coefficient = 1000000;
const baseWidthPercentage = 18;

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState(initialCredentials);
    const [showPassword, setShowPassword] = useState(false);

    const { windowSize, makeErrorAlert, makeBlackAlert, makeSuccessAlert } = useContext(ContextWrapper);

    // The size variables for responsiveness of the page
    const isNormalSize = (windowSize.width > 900 && windowSize.height > 475);
    const headerVariant = isNormalSize ? 'h4' : 'h5';
    const boxWidthPercentage = `${coefficient / Math.pow(windowSize.width, 1.7) + baseWidthPercentage}%`;
    const size = isNormalSize ? 'medium' : 'small';

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const inputChanged = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    }

    const login = async () => {
        setLoading(true);
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
                makeSuccessAlert('Login process was successful');
            } else {
                setLoading(false);
                makeErrorAlert((await response.text()).toString());
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
                    >
                        Login
                    </Button>
                    <Box
                        display='flex'
                        justifyContent='space-between'
                    >
                        <Button
                            size={size}
                            variant='text'
                            color='secondary'
                        >
                            Sign Up
                        </Button>
                        <Button
                            size={size}
                            variant='text'
                            color='secondary'
                        >
                            Forgot Password?
                        </Button>
                    </Box>
                </Box>
            }
            {loading && <CircularProgress color='secondary' />}
        </Box>
    );
}