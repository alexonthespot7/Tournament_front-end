import { useContext, useEffect, useState } from 'react';

import { Box, Card, CircularProgress, List, ListSubheader, Typography } from '@mui/material';

import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';

import { useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';

const findUsernameOfContestant = (username) => {
    return username ? username : '—';
}

export default function RoundsUser() {
    const [loading, setLoading] = useState(true);
    const [rounds, setRounds] = useState([]);

    //state for sort handling
    const [sortState, setSortState] = useState('none');

    const { windowSize, makeErrorAlert, makeWarningAlert, headerVariant, isNormalSize, deleteCookies, checkResponseLength } = useContext(ContextWrapper);

    const navigate = useNavigate();

    const isMedium = windowSize.width > 650;
    const isSmall = windowSize.width > 500;
    const isXSmall = windowSize.width > 400;

    const listHeadersTextSize = isNormalSize ? 20 : isMedium ? 17 : isSmall ? 14 : isXSmall ? 11 : 9;
    const rowTextSize = isNormalSize ? 16 : isMedium ? 13 : isSmall ? 10 : 7;

    useEffect(() => {
        fetchRounds();
    }, []);

    const fetchRounds = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/rounds`, {
                method: 'GET',
                headers: { 'Authorization': Cookies.get('jwt') }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    deleteCookies();
                    navigate('/login');
                    makeErrorAlert('Your session has expired, login again please');
                } else {
                    checkResponseLength(response);
                }
                return null;
            }
            if (response.status === 202) {
                navigate('/');
                makeWarningAlert('The bracket wasn\'t made yet')
            } else {
                response.json()
                    .then(data => {
                        setRounds(data);
                        setLoading(false);
                    })
                    .catch(err => makeErrorAlert(err.message));
            }
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    //different sorting cases
    const sortMethods = {
        none: { method: () => null },
        contestant1_asc: { method: (a, b) => findUsernameOfContestant(a.usernameOfCompetitor1).localeCompare(findUsernameOfContestant(b.usernameOfCompetitor1)) },
        contestant1_desc: { method: (a, b) => findUsernameOfContestant(b.usernameOfCompetitor1).localeCompare(findUsernameOfContestant(a.usernameOfCompetitor1)) },

        contestant2_asc: { method: (a, b) => findUsernameOfContestant(a.usernameOfCompetitor2).localeCompare(findUsernameOfContestant(b.usernameOfCompetitor2)) },
        contestant2_desc: { method: (a, b) => findUsernameOfContestant(b.usernameOfCompetitor2).localeCompare(findUsernameOfContestant(a.usernameOfCompetitor2)) },

        //special case for sorting final, also sorting backwards, as 1/2 is logically higher than 1/4, etc.
        stage_asc: {
            method: (a, b) => {
                if ([a.stage, b.stage].includes('final')) return a.stage.localeCompare(b.stage);
                return b.stage.localeCompare(a.stage);
            }
        },
        stage_desc: {
            method: (a, b) => {
                if ([a.stage, b.stage].includes('final')) return b.stage.localeCompare(a.stage);
                return a.stage.localeCompare(b.stage);
            }
        },
        result_asc: { method: (a, b) => a.result.localeCompare(b.result) },
        result_desc: { method: (a, b) => b.result.localeCompare(a.result) }
    }

    const filteredRounds = rounds.sort(sortMethods[sortState].method);

    function SortIcon() {
        if (sortState.includes('_asc')) {
            return (
                <NorthIcon fontSize='small' />
            );
        } else if (sortState.includes('_desc')) {
            return (
                <SouthIcon fontSize='small' />
            );
        }
    }

    const handleSortState = (property) => {
        sortState.includes('_asc')
            ? setSortState(`${property}_desc`)
            : sortState.includes('_desc')
                ? setSortState('none')
                : setSortState(`${property}_asc`);
    }

    return (
        <Box
            mt='2.5%'
            width='100%'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            height='90%'
        >
            {!loading &&
                <>
                    <Typography
                        variant={isMedium ? headerVariant : 'h6'}
                        sx={{ mb: '1%' }}
                    >
                        Rounds
                    </Typography>
                    <List
                        sx={{
                            width: isSmall ? '85%' : '95%',
                            maxHeight: windowSize.height <= 350 ? '50%' : isSmall ? '65%' : '75%',
                            overflow: 'auto'
                        }}
                        subheader={
                            <ListSubheader
                                color='secondary'
                                sx={{
                                    backgroundColor: '#f0f0f0',
                                    boxShadow: 8,
                                    py: isNormalSize ? '1%' : '1.5%',
                                    px: isNormalSize ? '2%' : '3%',
                                    m: isNormalSize ? '1%' : '1.5%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box
                                    display='flex'
                                    flexDirection='row'
                                    sx={{ flex: 2 }}
                                    alignItems='center'
                                >
                                    <Typography
                                        align='left'
                                        fontWeight={900}
                                        fontSize={listHeadersTextSize}
                                        sx={{ '&:hover': { cursor: 'pointer' }, }}
                                        onClick={() => handleSortState('stage')}
                                    >
                                        Stage
                                    </Typography>
                                    {sortState.includes('stage') && <SortIcon />}
                                </Box>
                                <Box
                                    display='flex'
                                    flexDirection='row'
                                    sx={{ flex: 3 }}
                                    justifyContent='center'
                                    alignItems='center'
                                >
                                    <Typography
                                        align='center'
                                        fontWeight={900}
                                        fontSize={listHeadersTextSize}
                                        sx={{ '&:hover': { cursor: 'pointer' }, }}
                                        onClick={() => handleSortState('contestant1')}
                                    >
                                        Contestant 1
                                    </Typography>
                                    {sortState.includes('contestant1') && <SortIcon />}
                                </Box>
                                <Box
                                    display='flex'
                                    flexDirection='row'
                                    sx={{ flex: 3 }}
                                    justifyContent='center'
                                    alignItems='center'
                                >
                                    {sortState.includes('contestant2') && <SortIcon />}
                                    <Typography
                                        align='center'
                                        fontWeight={900}
                                        fontSize={listHeadersTextSize}
                                        sx={{ '&:hover': { cursor: 'pointer' }, }}
                                        onClick={() => handleSortState('contestant2')}
                                    >
                                        Contestant 2
                                    </Typography>
                                </Box>
                                <Box
                                    display='flex'
                                    flexDirection='row'
                                    sx={{ flex: 2 }}
                                    justifyContent='flex-end'
                                    alignItems='center'
                                >
                                    {sortState.includes('result') && <SortIcon />}
                                    <Typography
                                        align='right'
                                        fontWeight={900}
                                        fontSize={listHeadersTextSize}
                                        sx={{ '&:hover': { cursor: 'pointer' }, }}
                                        onClick={() => handleSortState('result')}
                                    >
                                        Result
                                    </Typography>
                                </Box>
                            </ListSubheader>}
                    >
                        {filteredRounds.map((round, index) => (
                            <Card
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    py: isNormalSize ? '2%' : '3%',
                                    px: isNormalSize ? '3%' : '4.5%',
                                    m: isNormalSize ? '1%' : '1.5%',
                                    my: isSmall ? '' : isXSmall ? '1%' : '2.5%'
                                }}
                            >
                                <Typography
                                    fontSize={rowTextSize}
                                    align='left'
                                    sx={{ flex: 2 }}
                                >
                                    {round.stage}
                                </Typography>
                                <Typography
                                    fontSize={rowTextSize}
                                    align='center'
                                    sx={{ flex: 3 }}
                                >
                                    {findUsernameOfContestant(round.usernameOfCompetitor1)}
                                </Typography>
                                <Typography
                                    fontSize={rowTextSize}
                                    align='center'
                                    sx={{ flex: 3 }}
                                >
                                    {findUsernameOfContestant(round.usernameOfCompetitor2)}
                                </Typography>
                                <Typography
                                    fontSize={rowTextSize}
                                    align='right'
                                    sx={{ flex: 2 }}
                                >
                                    {round.result}
                                </Typography>
                            </Card>
                        ))}
                    </List>
                </>
            }
            {loading && <CircularProgress color='secondary' />}
        </Box >
    );
}