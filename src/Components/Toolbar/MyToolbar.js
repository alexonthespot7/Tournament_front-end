import { useContext } from 'react';

import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';

import WestIcon from '@mui/icons-material/West';
import LogoutIcon from '@mui/icons-material/Logout';

import { useLocation, useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';

import logo_transparent from '../../assets/logo_transparent.png';

export default function MyToolbar() {
    const { windowSize, size, makeSuccessAlert, isNormalSize, deleteCookies } = useContext(ContextWrapper);

    const location = useLocation();

    const navigate = useNavigate();

    const imageWidth = 165 + windowSize.width / 28;

    const logOut = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            deleteCookies();
            navigate('/login');
            makeSuccessAlert('You\'ve log out successfully');
        }
    }

    const goBack = () => {
        if (location.pathname === '/admin/stages') {
            navigate('/admin/users');
        } else {
            navigate('/');
        }
    }

    return (
        <AppBar
            position='fixed'
            sx={{
                background: 'linear-gradient(to right, #E2E2E2 0%, #f4f4f4 50%, #E2E2E2 100%)',
                boxShadow: 7
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {location.pathname !== '/' &&
                    <IconButton
                        onClick={goBack}
                        sx={{
                            position: 'fixed',
                            left: '2%'
                        }}
                        size={size}
                        color='secondary'
                    >
                        <WestIcon fontSize={size} />
                    </IconButton>
                }
                <img
                    src={logo_transparent}
                    width={imageWidth}
                    height='auto'
                    alt='Logo'
                />
                {Cookies.get('jwt') &&
                    <Box
                        position='fixed'
                        right='2%'
                        display='flex'
                        gap='1%'
                        alignItems='center'
                    >
                        {windowSize.width > 600 &&
                            <Typography
                                color='secondary'
                                fontSize={isNormalSize ? 18 : 14}
                            >
                                {Cookies.get('username')}
                            </Typography>
                        }
                        <IconButton
                            onClick={logOut}
                            size={size}
                            color='secondary'
                        >
                            <LogoutIcon fontSize={size} />
                        </IconButton>
                    </Box>
                }
            </Toolbar>
        </AppBar>
    );
}