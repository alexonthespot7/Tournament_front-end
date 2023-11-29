import { useContext } from 'react';
import { Box, Button } from '@mui/material';
import ContextWrapper from '../../context/ContextWrapper';

export default function PublicMainContent() {

    const { size } = useContext(ContextWrapper);

    return (
        <Box
            display='flex'
            justifyContent='space-around'
            width='100%'
        >
            <Button
                size={size}
                sx={{
                    transition: '0.35s',
                    '&:hover': { backgroundColor: '#555555' }
                }}
                variant='contained'
                color='secondary'
            >
                Login
            </Button>
            <Button
                size={size}
                sx={{
                    transition: '0.35s',
                    '&:hover': { backgroundColor: '#b4b4b4' }
                }}
                variant='outlined'
                color='secondary'
            >
                Signup
            </Button>
        </Box>
    );
}