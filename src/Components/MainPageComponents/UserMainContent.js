import { useContext, useEffect, useState } from 'react';

import { Box, CircularProgress } from '@mui/material';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';
import ContainedButton from './ContainedButton';
import OutlinedButton from './OutlinedButton';

export default function UserMainContent() {
    const [roundsQuantity, setRoundsQuantity] = useState(0);
    const [loading, setLoading] = useState(true);

    const { windowSize, makeErrorAlert } = useContext(ContextWrapper);

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
                <ContainedButton
                    link='/competitors'
                    content='Competitors'
                />
            );
        } else if (roundsQuantity > 0) {
            return (
                <ContainedButton
                    link='/admin/rounds'
                    content='Rounds'
                />
            );
        } else {
            return (
                <ContainedButton
                    link='/admin/users'
                    content='Users'
                />
            );
        }
    }

    function SecondButton() {
        if (Cookies.get('role') === 'USER') {
            return (
                <OutlinedButton
                    link='/rounds'
                    content='Rounds'
                />
            );
        } else {
            return (
                <OutlinedButton
                    link='/admin/users'
                    content='Users'
                />
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
            alignItems='center'
        >
            {!loading &&
                <>
                    <Box
                        display='flex'
                        justifyContent='space-around'
                        width='100%'
                    >
                        <FirstButton />
                        <OutlinedButton
                            link={`/competitors/${Cookies.get('userId')}`}
                            content='Personal page'
                        />
                    </Box>
                    {roundsQuantity > 0 &&
                        <Box
                            display='flex'
                            justifyContent='space-around'
                            width='100%'
                        >
                            <SecondButton />
                            <ContainedButton
                                link='/bracket'
                                content='Bracket'
                            />
                        </Box>
                    }
                </>
            }
            {loading && <CircularProgress color='secondary' />}
        </Box>
    );
}
