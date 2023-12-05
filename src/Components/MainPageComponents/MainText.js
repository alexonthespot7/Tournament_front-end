import { useContext } from 'react';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';
import { Typography } from '@mui/material';

export default function MainText() {
    const { windowSize, isNormalSize } = useContext(ContextWrapper);

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

    function CustomTypography({ line1, line2 }) {
        return (
            <Typography
                fontSize={textSize}
                sx={textSx}
                fontWeight='bold'
            >
                {line1}
                <br />
                {line2}
            </Typography>
        );
    }

    return (
        <>
            {!Cookies.get('role') &&
                <CustomTypography
                    line1='Join the competition, follow the playoff bracket, check competitors, and track rounds.'
                    line2='Not registered? Sign up now! Already a member ? Log in to keep up with the action!'
                />
            }
            {Cookies.get('role') === 'USER' &&
                <CustomTypography
                    line1='Follow the playoff bracket, check competitors, and track rounds.'
                    line2='Manage your personal data on your page, where you can also find all your rounds!'
                />
            }
            {Cookies.get('role') === 'ADMIN' &&
                <CustomTypography
                    line1='Follow the playoff bracket, check competitors, and track rounds.'
                    line2='Go to users page to find more tournament management options!'
                />
            }
        </>
    );
}