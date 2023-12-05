import { useContext } from 'react';

import { Box, Typography } from '@mui/material';

import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import WebAssetIcon from '@mui/icons-material/WebAsset';

import Cookies from 'js-cookie';

import PublicMainContent from './PublicMainContent';
import UserMainContent from './UserMainContent';
import ContextWrapper from '../../context/ContextWrapper';
import MainText from './MainText';
import SocialButton from './SocialButton';

export default function Main() {
    const { windowSize, size, isNormalSize } = useContext(ContextWrapper);

    const isScreenMedium = windowSize.height > 500;

    //windowSize.width in power of 2.4
    const coefficient = 40671182;

    // This formula allows the width peracntage to grow, when the screen width decreases
    const mainBoxWidth = `${45 + coefficient / Math.pow(windowSize.width, 2.4)}%`;

    const bottomRowWidth = `${60 + coefficient / Math.pow(windowSize.width, 2.4)}%`;

    return (
        <Box
            mt={isScreenMedium ? '10%' : '15%'}
            mb={'5%'}
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
                <MainText />
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
                    border: '2px solid #171717', // Border style and color
                    padding: isNormalSize ? '15px' : '10px', // Padding for the bottom row
                    width: bottomRowWidth,
                    maxWidth: '90%'
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
                    <SocialButton
                        icon={<LinkedInIcon fontSize={size} />}
                        link='https://www.linkedin.com/in/alexonthespot'
                        color='primary'
                    />
                    <SocialButton
                        icon={<GitHubIcon fontSize={size} />}
                        link='https://github.com/alexonthespot7'
                        color='secondary'
                    />
                    <SocialButton
                        icon={<WebAssetIcon fontSize={size} />}
                        link='https://aleksei-shevelenkov.netlify.app'
                        color='secondary'
                    />
                </Box>
            </Box>
        </Box >
    );
}