import { Box, Button, Container, Grid, IconButton, Stack, Typography } from '@mui/material';
import '../App.css';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import PublicMainContent from './PublicComponents/PublicMainContent';
import UserMainContent from './UserComponents/UserMainContent';

export default function Main() {
    return (
        <Box sx={{ mt: 14, mb: 6 }} display='flex' flexDirection='column' alignItems='center' justifyContent='space-around' height='100%' width='45%'>
            {/* Top row */}
            <Box
                display="flex"
                justifyContent="center"
                width="100%"
            >
                <Typography sx={{ lineHeight: 2, letterSpacing: '0.7px' }} fontWeight='bold'>
                    Join the competition, follow the playoff bracket, check competitors, and track rounds. <br />
                    Not registered? Sign up now! Already a member? Log in to keep up with the action!
                </Typography>
            </Box>

            {/* Middle row */}
            <UserMainContent />

            {/* Bottom row */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    borderRadius: '12px', // Rounded corners for the bottom row
                    border: '2px solid #006494', // Border style and color
                    padding: '15px', // Padding for the bottom row
                    width: '50%'
                }}
            >
                <Typography sx={{ fontSize: 20, color: '#171717' }}>Author:</Typography>
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
                        <IconButton color='primary'>
                            <LinkedInIcon />
                        </IconButton>
                    </div>
                    <div style={{
                        display: 'inline-block',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        padding: '4px', // Adjust as needed to fit the icon properly
                    }}>
                        <IconButton color='secondary'>
                            <GitHubIcon />
                        </IconButton>
                    </div>
                    <div style={{
                        display: 'inline-block',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        padding: '4px', // Adjust as needed to fit the icon properly
                    }}>
                        <IconButton color='secondary'>
                            <WebAssetIcon />
                        </IconButton>
                    </div>
                </Box>
            </Box>

        </Box >
    );
}