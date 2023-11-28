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

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState(initialCredentials);
    const [showPassword, setShowPassword] = useState(false);

    const { windowSize, setAlertText, setAlertColor, setAlertOpen } = useContext(ContextWrapper);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const inputChanged = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    }

    const login = async () => {
        setLoading(true);
        console.log(process.env.REACT_APP_API_URL);
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
                setAlertOpen(true);
                setAlertColor('success');
                setAlertText('Login process was successful');
            } else {
                setLoading(false);
                setAlertOpen(true);
                setAlertText(response.statusText);
            }
        } catch (error) {
            console.error(error);
            setAlertOpen(true);
            setAlertText('Can\'t reach the server at the moment');
        }
    }

    return (
        <Box
            sx={{ mt: 20, mb: 6 }}
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            height='100%'
            width='45%'
        >
            <Typography variant="h4" sx={{ mb: 6 }}>
                Login
            </Typography>
            {!loading &&
                <Box
                    display='flex'
                    flexDirection='column'
                    gap={2}
                    width='35%'
                    sx={{ textAlign: 'start' }}
                >
                    <Typography>Username:</Typography>
                    <TextField
                        color='secondary'
                        variant='outlined'
                        placeholder='Username'
                        name='username'
                        value={credentials.username}
                        onChange={inputChanged}
                    />
                    <Typography>Password:</Typography>
                    <OutlinedInput
                        color='secondary'
                        sx={{ mb: 2 }}
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
                        variant='contained'
                        color='secondary'
                        onClick={login}
                    >
                        Login
                    </Button>
                    <Box
                        display='flex'
                        justifyContent='space-between'
                    >
                        <Button variant='text' color='secondary'>
                            Sign Up
                        </Button>
                        <Button variant='text' color='secondary'>
                            Forgot Password?
                        </Button>
                    </Box>
                </Box>
            }
            {loading && <CircularProgress color='secondary' />}
        </Box>
    );
}