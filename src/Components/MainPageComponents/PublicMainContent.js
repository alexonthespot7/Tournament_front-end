import { Box } from '@mui/material';

import ContainedButton from './ContainedButton';
import OutlinedButton from './OutlinedButton';

export default function PublicMainContent() {
    return (
        <Box
            display='flex'
            justifyContent='space-around'
            width='100%'
        >
            <ContainedButton
                link='/login'
                content='Login'
            />
            <OutlinedButton
                link='/signup'
                content='Signup'
            />
        </Box>
    );
}