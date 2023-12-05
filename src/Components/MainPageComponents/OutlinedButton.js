import { useContext } from 'react';

import { Button } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import ContextWrapper from '../../context/ContextWrapper';

export default function OutlinedButton({ link, content }) {
    const { size } = useContext(ContextWrapper);

    const navigate = useNavigate();

    return (
        <Button
            onClick={() => navigate(link)}
            size={size}
            sx={{
                transition: '0.35s',
                '&:hover': { backgroundColor: '#b4b4b4' }
            }}
            variant='outlined'
            color='secondary'
        >
            {content}
        </Button>
    );
}