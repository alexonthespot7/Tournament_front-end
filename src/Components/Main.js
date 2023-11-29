import { Box, Button, Container, Grid, IconButton, Stack, Typography } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import WebAssetIcon from '@mui/icons-material/WebAsset';

import Cookies from 'js-cookie';

import PublicMainContent from './PublicComponents/PublicMainContent';
import UserMainContent from './UserComponents/UserMainContent';
import { useContext } from 'react';
import ContextWrapper from '../context/ContextWrapper';



export default function Main() {
    const { windowSize, size, isNormalSize } = useContext(ContextWrapper);

    const isScreenMedium = windowSize.height > 500;

    const textSize = isNormalSize ? 16 : isScreenMedium ? 14 : 12;

    const textSx = isNormalSize ? {
        lineHeight: 2,
        letterSpacing: '0.7px'
    } : isScreenMedium ? {
        lineHeight: 1.75,
        letterSpacing: '0.5px'
    } : {
        lineHeight: 1.5,
        letterSpacing: '0.4px'
    }

    //windowSize.width in power of 2.4
    const coefficient = 40671182;

    // This formula allows the width peracntage to grow, when the screen width decreases
    const mainBoxWidth = `${45 + coefficient / Math.pow(windowSize.width, 2.4)}%`;

    const bottomRowWidth = `${60 + coefficient / Math.pow(windowSize.width, 2.4)}%`;

    function MainTextComponent() {
        if (!Cookies.get('role')) {
            return (
                <Typography
                    fontSize={textSize}
                    sx={textSx}
                    fontWeight='bold'
                >
                    Join the competition, follow the playoff bracket, check competitors, and track rounds. <br />
                    Not registered? Sign up now! Already a member? Log in to keep up with the action!
                </Typography>
            );
        } else if (Cookies.get('role') === 'USER') {
            return (
                <Typography
                    fontSize={textSize}
                    sx={textSx}
                    fontWeight='bold'
                >
                    Follow the playoff bracket, check competitors, and track rounds. <br />
                    Manage your personal data on your page, where you can also find all your rounds!
                </Typography>
            );
        } else {
            return (
                <Typography
                    fontSize={textSize}
                    sx={textSx}
                    fontWeight='bold'
                >
                    Follow the playoff bracket, check competitors, and track rounds. <br />
                    Go to users page to find more tournament management options!
                </Typography>
            );
        }
    }

    return (
        <Box
            sx={{ mt: isScreenMedium ? '10%' : '15%', mb: '5%' }}
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='space-around'
            height='90%'
            width={mainBoxWidth}
        >
            {/* Top row */}
            <Box
                display='flex'
                justifyContent='center'
                width='100%'
            >
                <MainTextComponent />
            </Box>

            {/* Middle row */}
            {!Cookies.get('role') && <PublicMainContent />}
            {Cookies.get('role') && <UserMainContent />}

            {/* Bottom row */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    borderRadius: '12px', // Rounded corners for the bottom row
                    border: '2px solid #006494', // Border style and color
                    padding: isNormalSize ? '15px' : '10px', // Padding for the bottom row
                    width: bottomRowWidth,
                    maxWidth: '95%'
                }}
            >
                <Typography
                    fontSize={isNormalSize ? 20 : 16}
                    color='#171717'
                >
                    Author:
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        width: '60%',
                    }}
                >
                    <div style={{
                        display: 'inline-block',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        padding: '4px', // Adjust as needed to fit the icon properly
                    }}>
                        <IconButton size={size} color='primary'>
                            <LinkedInIcon fontSize={size} />
                        </IconButton>
                    </div>
                    <div style={{
                        display: 'inline-block',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        padding: '4px', // Adjust as needed to fit the icon properly
                    }}>
                        <IconButton size={size} color='secondary'>
                            <GitHubIcon fontSize={size} />
                        </IconButton>
                    </div>
                    <div style={{
                        display: 'inline-block',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        padding: '4px', // Adjust as needed to fit the icon properly
                    }}>
                        <IconButton size={size} color='secondary'>
                            <WebAssetIcon fontSize={size} />
                        </IconButton>
                    </div>
                </Box>
            </Box>

        </Box >
    );
}