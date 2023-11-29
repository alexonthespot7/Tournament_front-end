import { Box, Button, CircularProgress, MenuItem, TextField, Typography } from "@mui/material";

import { useContext, useEffect, useState } from "react";
import ContextWrapper from "../../context/ContextWrapper";

const initialSignupForm = {
    isCompetitor: false,
    username: '',
    email: '',
    password: ''
}

const coefficient = 10000000;
const baseWidthPercentage = 32;

export default function Signup() {
    const [loading, setLoading] = useState(true);
    const [roundsQuantity, setRoundsQuantity] = useState(0);
    const [signupForm, setSignupForm] = useState(initialSignupForm);
    const [repeatPassword, setRepeatPassword] = useState('');

    const { windowSize, makeErrorAlert, makeBlackAlert, makeSuccessAlert } = useContext(ContextWrapper);

    // The size variables for responsiveness of the page
    const isNormalSize = (windowSize.width > 900 && windowSize.height > 475);
    const headerVariant = isNormalSize ? 'h4' : 'h5';
    const boxWidthPercentage = `${coefficient / Math.pow(windowSize.width, 1.9) + baseWidthPercentage}%`;
    const size = isNormalSize ? 'medium' : 'small';
    const gap = isNormalSize ? windowSize.height / 400 : windowSize.height / 350;

    useEffect(() => {
        fetchRoundsQuantity();
    }, []);

    const fetchRoundsQuantity = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/roundsquantity`)
            if (!response.ok) {
                makeErrorAlert('Something is wrong with the server');
                return null;
            }
            setRoundsQuantity((await response.text()));
            setLoading(false);
        } catch (error) {
            makeErrorAlert('Something is wrong with the server');
        }
    }

    const inputChanged = (event) => {
        setSignupForm({ ...signupForm, [event.target.name]: event.target.value })
    }


    const signup = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupForm)
            });
            if (response.ok) {
                setRepeatPassword('');
                setSignupForm(initialSignupForm);
                setLoading(false);
                makeSuccessAlert('Signup process went well, we sent a verification link to your email');
            } else {
                setLoading(false);
                makeErrorAlert((await response.text()).toString());
            }
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    const performSignup = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        for (const key of Object.keys(signupForm)) {
            if (signupForm[key] === '') {
                makeBlackAlert(`${key} is mandatory`);
                return null;
            }
        }
        if (signupForm.username.includes(' ')) {
            makeBlackAlert('Username must not include whitespaces');
        } else if (signupForm.username.length > 15) {
            makeBlackAlert('The username must not be longer than 15 symbols');
        } else if (!emailPattern.test(signupForm.email)) {
            makeBlackAlert('Please provide valid email');
        } else if (signupForm.password !== repeatPassword) {
            makeBlackAlert('Passwords should match');
        } else {
            setLoading(true)
            signup();
        }
    }

    return (
        <Box
            sx={{ mt: '10%', mb: '2%' }}
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='flex-start'
            height='100%'
            width='45%'
        >
            {!loading &&
                <>
                    <Box
                        display='flex'
                        flexDirection='row'
                        alignItems='center'
                        justifyContent='space-around'
                        width='95%'
                    >
                        <Typography variant={headerVariant} sx={{ mb: 2 }}>
                            Signup
                        </Typography>
                        {windowSize.height < 410 &&
                            <Button
                                variant='outlined'
                                color='secondary'
                                size='small'
                                onClick={performSignup}
                            >
                                Sign-up
                            </Button>
                        }
                    </Box>
                    <Box
                        display='flex'
                        flexDirection='column'
                        gap={gap}
                        width={boxWidthPercentage}
                        sx={{ textAlign: 'start' }}
                    >
                        <TextField
                            size={size}
                            color='secondary'
                            variant='outlined'
                            label='Username'
                            fullWidth
                            name='username'
                            value={signupForm.username}
                            onChange={inputChanged}
                        />
                        <TextField
                            size={size}
                            color='secondary'
                            variant='outlined'
                            label='Email'
                            fullWidth
                            name='email'
                            value={signupForm.email}
                            onChange={inputChanged}
                        />
                        <TextField
                            size={size}
                            color='secondary'
                            variant='outlined'
                            type='password'
                            label='Password'
                            fullWidth
                            name='password'
                            value={signupForm.password}
                            onChange={inputChanged}
                        />
                        <TextField
                            size={size}
                            color='secondary'
                            variant='outlined'
                            type='password'
                            label='Repeat password'
                            fullWidth
                            value={repeatPassword}
                            onChange={(event) => setRepeatPassword(event.target.value)}
                        />
                        {!(roundsQuantity > 0) &&
                            <TextField
                                size={size}
                                color='secondary'
                                variant='outlined'
                                label='Participant?'
                                fullWidth
                                select
                                name='isCompetitor'
                                value={signupForm.isCompetitor}
                                onChange={inputChanged}
                            >
                                <MenuItem value={false}>No</MenuItem>
                                <MenuItem value={true}>Yes</MenuItem>
                            </TextField>
                        }
                        {windowSize.height >= 410 &&
                            <Button
                                size={size}
                                onClick={performSignup}
                                variant='contained'
                                color='secondary'
                                sx={{ width: '100%' }}
                            >
                                Sign-up
                            </Button>
                        }
                        <Box
                            display='flex'
                            justifyContent='flex-start'
                        >
                            {windowSize.height > 450 &&
                                <Button
                                    size={size}
                                    variant='text'
                                    color='secondary'
                                >
                                    Login
                                </Button>
                            }
                        </Box>
                    </Box>
                </>
            }
            {loading &&
                <Box
                    height='70%'
                    display='flex'
                    alignItems='center'
                >
                    <CircularProgress color='secondary' />
                </Box>
            }
        </Box>

    );
}