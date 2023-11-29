import { Box, Card, CircularProgress, IconButton, List, ListSubheader, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import { useContext, useEffect, useState } from "react";
import ContextWrapper from "../../context/ContextWrapper";
import Cookies from "js-cookie";

const initialPersonalInfo = {
    username: '',
    email: '',
    stage: '',
    roundsQuantity: 0,
    publicRounds: [],
    out: false,
    competitor: true
}

export default function PersonalPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [personalInfo, setPersonalInfo] = useState(initialPersonalInfo);
    //state for sort handling
    const [sortState, setSortState] = useState('none');

    const { windowSize, makeErrorAlert, makeBlackAlert, headerVariant, isNormalSize, deleteCookies } = useContext(ContextWrapper);

    const findResult = (round) => {
        let result = round.result;
        if (!result.includes(' ')) return 'No';
        let winner = result.substring(0, result.indexOf(' '));
        return winner === personalInfo.username ? 'Victory' : 'Defeat';
    }

    const findOpponent = (round) => {
        return round.usernameOfCompetitor1 === personalInfo.username ? round.usernameOfCompetitor2 : round.usernameOfCompetitor1;
    }

    //different sorting cases
    const sortMethods = {
        none: { method: () => null },
        opponent_asc: { method: (a, b) => findOpponent(a).localeCompare(findOpponent(b)) },
        opponent_desc: { method: (a, b) => findOpponent(b).localeCompare(findOpponent(a)) },

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
        result_asc: { method: (a, b) => findResult(a).localeCompare(findResult(b)) },
        result_desc: { method: (a, b) => findResult(b).localeCompare(findResult(a)) }
    }

    useEffect(() => {
        if (!Cookies.get('userId')) {
            deleteCookies();
            //redirect to login;
        } else {
            fetchPersonalInfo();
        }
    }, []);

    const fetchPersonalInfo = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/competitors/${Cookies.get('userId')}`, {
                method: 'GET',
                headers: { 'Authorization': Cookies.get('jwt') }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    deleteCookies();
                    makeErrorAlert('Your session has expired. Please login again');
                } else {
                    makeErrorAlert(await response.text());
                }
                return null;
            }

            response.json()
                .then(data => {
                    if (!data) {
                        makeBlackAlert('You have no access to this page');
                        //redirect to main page;
                    } else {
                        setPersonalInfo(data);
                        setLoading(false);
                    }
                })
                .catch(err => makeErrorAlert(err.message));
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    const filteredRounds = personalInfo.publicRounds.sort(sortMethods[sortState].method);

    return (
        <Box sx={{ mt: '4%' }} gap='2.5%' width='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center' height='90%' >
            {!loading &&
                <>
                    <Box width='9%' sx={{ mb: '1%' }} display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
                        <Typography variant="h4" >
                            Profile
                        </Typography>
                        {!isEditing && <IconButton
                            color='secondary'
                            onClick={() => setIsEditing(true)}
                        >
                            <EditIcon />
                        </IconButton>}
                        {isEditing && <IconButton
                            color='secondary'
                            onClick={() => setIsEditing(false)}
                        >
                            <CheckIcon />
                        </IconButton>}
                    </Box>
                    <Box width='50%' display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
                        <Typography sx={{ flex: 1 }} fontWeight={900} fontSize={20}>Username:</Typography>
                        <Typography sx={{ flex: 1 }} fontWeight={900} fontSize={20}>Email:</Typography>
                    </Box>
                    <Box mb={2} width='50%' display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
                        <Typography sx={{ flex: 1 }} fontStyle='italic' fontSize={18}>{personalInfo.username}</Typography>
                        <Typography sx={{ flex: 1 }} fontStyle='italic' fontSize={18}>{personalInfo.email}</Typography>
                    </Box>
                    {personalInfo.roundsQuantity !== 0 && personalInfo.isCompetitor && <Box width='50%' display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
                        <Typography sx={{ flex: 1 }} fontWeight={900} fontSize={20}>Stage:</Typography>
                        <Typography sx={{ flex: 1 }} fontWeight={900} fontSize={20}>Status:</Typography>
                    </Box>}
                    {personalInfo.roundsQuantity !== 0 && personalInfo.isCompetitor && <Box width='50%' display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
                        <Typography sx={{ flex: 1 }} fontStyle='italic' fontSize={18}>{personalInfo.stage}</Typography>
                        <Typography sx={{ flex: 1 }} fontStyle='italic' fontSize={18}>{!personalInfo.isOut ? 'In' : 'Out'}</Typography>
                    </Box>}
                    {(personalInfo.roundsQuantity === 0 || !personalInfo.isCompetitor) && <Box width='50%' display='flex' flexDirection='row' alignItems='center' justifyContent='center' gap='2.5%'>
                        <Typography fontWeight={900} fontSize={20}>Participant:</Typography>
                        <Typography fontStyle='italic' fontSize={18}>{personalInfo.isCompetitor ? 'Yes' : 'No'}</Typography>
                    </Box>}
                    {personalInfo.publicRounds.length > 0 && <Typography mt='1%' variant="h5" fontStyle='italic'>
                        Rounds
                    </Typography>}
                    {personalInfo.publicRounds.length > 0 && <List
                        sx={{ width: '70%', maxHeight: '42.5%', overflow: 'auto' }}
                        subheader={
                            <ListSubheader
                                color='secondary'
                                sx={{
                                    backgroundColor: '#f0f0f0',
                                    boxShadow: 7,
                                    py: '1%',
                                    px: '2%',
                                    m: '1%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box display='flex' flexDirection='row' sx={{ flex: 1 }} alignItems='center'>
                                    <Typography
                                        align='left'
                                        fontWeight={900}
                                        fontSize={20}
                                        sx={{ '&:hover': { cursor: 'pointer' }, }}
                                        onClick={() => sortState === 'stage_asc' ? setSortState('stage_desc') : sortState === 'stage_desc' ? setSortState('none') : setSortState('stage_asc')}
                                    >
                                        Stage
                                    </Typography>
                                    {sortState === 'stage_asc' && <NorthIcon fontSize='small' />}
                                    {sortState === 'stage_desc' && <SouthIcon fontSize='small' />}
                                </Box>
                                <Box display='flex' flexDirection='row' sx={{ flex: 5 }} justifyContent='center' alignItems='center'>
                                    <Typography
                                        align='center'
                                        fontWeight={900}
                                        fontSize={20}
                                        sx={{ '&:hover': { cursor: 'pointer' }, }}
                                        onClick={() => sortState === 'opponent_asc' ? setSortState('opponent_desc') : sortState === 'opponent_desc' ? setSortState('none') : setSortState('opponent_asc')}
                                    >
                                        Opponent
                                    </Typography>
                                    {sortState === 'opponent_asc' && <NorthIcon fontSize='small' />}
                                    {sortState === 'opponent_desc' && <SouthIcon fontSize='small' />}
                                </Box>
                                <Box display='flex' flexDirection='row' sx={{ flex: 1 }} justifyContent='flex-end' alignItems='center'>
                                    {sortState === 'result_asc' && <NorthIcon fontSize='small' />}
                                    {sortState === 'result_desc' && <SouthIcon fontSize='small' />}
                                    <Typography
                                        align='right'
                                        fontWeight={900}
                                        fontSize={20}
                                        sx={{ '&:hover': { cursor: 'pointer' }, }}
                                        onClick={() => sortState === 'result_asc' ? setSortState('result_desc') : sortState === 'result_desc' ? setSortState('none') : setSortState('result_asc')}
                                    >
                                        Result
                                    </Typography>
                                </Box>
                            </ListSubheader>}
                    >
                        {filteredRounds.map((round, index) => (
                            <Card key={index} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', py: '2%', px: '3%', m: '1%' }}>
                                <Typography align='left' sx={{ flex: 1 }}>{round.stage} </Typography>
                                <Typography align='center' sx={{ flex: 5 }}>{findOpponent(round)} </Typography>
                                <Typography align='right' sx={{ flex: 1 }}>{findResult(round)} </Typography>
                            </Card>
                        ))}
                    </List>}
                </>
            }
            {loading && <CircularProgress color='secondary' />}
        </Box >
    );
}