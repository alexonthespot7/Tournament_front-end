import { useContext, useEffect, useState } from 'react';

import { Box, Button, CircularProgress } from '@mui/material';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';
import { useNavigate } from 'react-router-dom';


export default function UserMainContent() {
    const [roundsQuantity, setRoundsQuantity] = useState(0);
    const [loading, setLoading] = useState(true);

    const { windowSize, makeErrorAlert, size } = useContext(ContextWrapper);

    const navigate = useNavigate();

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
            setRoundsQuantity(await response.text());
            setLoading(false);
        } catch (error) {
            makeErrorAlert('Something is wrong with the server');
        }
    }

    function FirstButton() {
        if (Cookies.get('role') === 'USER') {
            return (
                <Button
                    onClick={() => navigate('/competitors')}
                    size={size}
                    sx={{
                        transition: '0.35s',
                        '&:hover': { backgroundColor: '#555555' }
                    }}
                    variant='contained'
                    color='secondary'
                >
                    Competitors
                </Button>
            );
        } else if (roundsQuantity > 0) {
            return (
                <Button
                    onClick={() => navigate('/admin/rounds')}
                    size={size}
                    sx={{
                        transition: '0.35s',
                        '&:hover': { backgroundColor: '#555555' }
                    }}
                    variant='contained'
                    color='secondary'
                >
                    Rounds
                </Button>
            );
        } else {
            return (
                <Button
                    onClick={() => navigate('/admin/users')}
                    size={size}
                    sx={{
                        transition: '0.35s',
                        '&:hover': { backgroundColor: '#555555' }
                    }}
                    variant='contained'
                    color='secondary'
                >
                    Users
                </Button>
            );
        }
    }

    function SecondButton() {
        if (Cookies.get('role') === 'USER') {
            return (
                <Button
                    onClick={() => navigate('/rounds')}
                    size={size}
                    sx={{
                        transition: '0.35s',
                        '&:hover': { backgroundColor: '#b4b4b4' }
                    }}
                    variant='outlined'
                    color='secondary'
                >
                    Rounds
                </Button>
            );
        } else {
            return (
                <Button
                    onClick={() => navigate('/admin/users')}
                    size={size}
                    sx={{
                        transition: '0.35s',
                        '&:hover': { backgroundColor: '#b4b4b4' }
                    }}
                    variant='outlined'
                    color='secondary'
                >
                    Users
                </Button>
            );
        }
    }

    return (
        <Box
            display='flex'
            flexDirection='column'
            gap={windowSize.height / 75}
            width='100%'
            justifyContent='center'
        >
            {!loading &&
                <>
                    <Box
                        display='flex'
                        justifyContent='space-around'
                        width='100%'
                    >
                        <FirstButton />
                        <Button
                            onClick={() => navigate(`/competitors/${Cookies.get('userId')}`)}
                            size={size}
                            sx={{
                                transition: '0.35s',
                                '&:hover': { backgroundColor: '#b4b4b4' }
                            }}
                            variant='outlined'
                            color='secondary'
                        >
                            Personal page
                        </Button>
                    </Box>
                    {roundsQuantity > 0 &&
                        <Box
                            display='flex'
                            justifyContent='space-around'
                            width='100%'
                        >
                            <SecondButton />
                            <Button
                                onClick={() => navigate('/bracket')}
                                size={size}
                                sx={{
                                    transition: '0.35s',
                                    '&:hover': { backgroundColor: '#555555' }
                                }}
                                variant='contained'
                                color='secondary'
                            >
                                Bracket
                            </Button>
                        </Box>
                    }
                </>
            }
            {loading && <CircularProgress color='secondary' />}
        </Box>
    );
}