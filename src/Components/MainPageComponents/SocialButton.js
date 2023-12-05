import { useContext } from 'react';

import { IconButton } from '@mui/material';

import ContextWrapper from '../../context/ContextWrapper';

export default function SocialButton({ icon, link, color }) {
    const { size } = useContext(ContextWrapper);
    return (
        <div
            style={{
                display: 'inline-block',
                borderRadius: '50%',
                backgroundColor: 'white',
                padding: '4px',
            }}
        >
            <IconButton
                onClick={() => window.open(link)}
                size={size}
                color={color}
            >
                {icon}
            </IconButton>
        </div>
    );
}