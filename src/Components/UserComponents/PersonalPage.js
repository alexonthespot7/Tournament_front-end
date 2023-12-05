import { useContext, useEffect, useState } from 'react';

import { Box, Button, Card, CircularProgress, IconButton, List, ListSubheader, MenuItem, TextField, Typography } from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';
import ChangePassword from './ChangePassword';
import { useNavigate } from 'react-router-dom';

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
    const [personalInfoUpdated, setPersonalInfoUpdated] = useState(initialPersonalInfo);
    //state for sort handling
    const [sortState, setSortState] = useState('none');

    const { windowSize, makeErrorAlert, makeSuccessAlert, headerVariant, size, isNormalSize, deleteCookies, checkResponseLength } = useContext(ContextWrapper);

    const navigate = useNavigate();

    const isMedium = windowSize.width > 550;

    // This way the percentage grows inversely to the screen height
    const percentageCalculator = (initialPercentage) => {
        return `${initialPercentage + Math.pow(1536, 3) / Math.pow(windowSize.width, 3)}%`;
    }

    const fieldsBoxWidth = isNormalSize ? percentageCalculator(60) : isMedium ? percentageCalculator(75) : '100%';

    const fieldsHeadersSize = isNormalSize ? 20 : isMedium ? 17 : 14;

    const fieldsTextSize = isNormalSize ? 18 : isMedium ? 15 : 12;

    const textInTableSize = isNormalSize ? 16 : 13;

    const findResult = (round) => {
        let result = round.result;
        if (!result.includes(' ')) return 'No';
        let winner = result.substring(0, result.indexOf(' '));
        return winner === personalInfo.username ? 'Victory' : 'Defeat';
    }

    const findOpponent = (round) => {
        let opponent = round.usernameOfCompetitor1 === personalInfo.username ? round.usernameOfCompetitor2 : round.usernameOfCompetitor1;
        return opponent ? opponent : '—';
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
            navigate('/login');
            makeErrorAlert('You don\'t have access now');
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
                    navigate('/login');
                    makeErrorAlert('Your session has expired. Please login again');
                } else if (response.status === 403) {
                    navigate('/');
                    makeErrorAlert('This page is forbidden for you');
                } else {
                    checkResponseLength(response);
                }
                return null;
            }

            response.json()
                .then(data => {
                    setPersonalInfo(data);
                    setLoading(false);
                })
                .catch(err => makeErrorAlert(err.message));
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    const filteredRounds = personalInfo.publicRounds.sort(sortMethods[sortState].method);

    const startEditing = () => {
        setIsEditing(true);
        setPersonalInfoUpdated(personalInfo);
    }

    const saveChanges = () => {
        if (!Cookies.get('userId')) {
            deleteCookies();
            navigate('/login');
            makeErrorAlert('You don\'t have access now');
        } else if (window.confirm('Are you sure you want to make changes')) {
            setLoading(true);
            updateUser();
        }
    }

    const updateUser = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/updateuser/${Cookies.get('userId')}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('jwt')
                },
                body: JSON.stringify(personalInfoUpdated)
            });
            if (!response.ok) {
                if (response.status === 401) {
                    deleteCookies();
                    navigate('/login');
                    makeErrorAlert('Your session has expired. Please login again');
                } else {
                    const responseText = await response.text();
                    if (responseText.length > 200) {
                        makeErrorAlert('Something wrong with the server');
                    } else {
                        makeErrorAlert(responseText);
                    }
                }
            } else {
                setLoading(false);
                setIsEditing(false);
                fetchPersonalInfo();
                makeSuccessAlert('User info was updated successfully');
            }

        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    function EditSign() {
        return personalInfo.roundsQuantity > 0 ? null : (
            <>
                {!isEditing &&
                    <IconButton
                        size={size}
                        color='secondary'
                        onClick={startEditing}
                    >
                        <EditIcon fontSize={size} />
                    </IconButton>
                }
                {isEditing &&
                    <Box display='flex' >
                        <IconButton
                            size={size}
                            color='secondary'
                            onClick={saveChanges}
                        >
                            <CheckIcon fontSize={size} />
                        </IconButton>
                        <IconButton
                            size={size}
                            color='secondary'
                            onClick={() => setIsEditing(false)}
                        >
                            <CloseIcon fontSize={size} />
                        </IconButton>
                    </Box>
                }
            </>
        );
    }

    return (
        <Box
            sx={{ mt: '5%' }}
            gap={isNormalSize ? '2.5%' : '1%'}
            width='100%'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            height='90%'
        >
            {!loading &&
                <>
                    <Box
                        sx={{ mb: '1%' }}
                        display='flex'
                        flexDirection='row'
                        justifyContent='space-between'
                        alignItems='center'
                    >
                        <Typography variant={headerVariant} >
                            Profile
                        </Typography>
                        <EditSign />
                    </Box>
                    <Box
                        width={fieldsBoxWidth}
                        display='flex'
                        flexDirection='row'
                        alignItems='center'
                        justifyContent='space-between'
                    >
                        <Typography
                            sx={{ flex: 1 }}
                            fontWeight={900}
                            fontSize={fieldsHeadersSize}
                        >
                            Username:
                        </Typography>
                        <Typography
                            sx={{ flex: 1 }}
                            fontWeight={900}
                            fontSize={fieldsHeadersSize}
                        >
                            Email:
                        </Typography>
                    </Box>
                    <Box
                        mb='1%'
                        width={fieldsBoxWidth}
                        display='flex'
                        flexDirection='row'
                        alignItems='center'
                        justifyContent='space-between'
                    >
                        <Typography
                            sx={{ flex: 1 }}
                            fontStyle='italic'
                            fontSize={fieldsTextSize}
                        >
                            {personalInfo.username}
                        </Typography>
                        <Typography
                            sx={{ flex: 1 }}
                            fontStyle='italic'
                            fontSize={fieldsTextSize}
                        >
                            {personalInfo.email}
                        </Typography>
                    </Box>
                    {personalInfo.roundsQuantity > 0 && personalInfo.competitor &&
                        <Box
                            width={fieldsBoxWidth}
                            display='flex'
                            flexDirection='row'
                            alignItems='center'
                            justifyContent='space-between'
                        >
                            <Typography
                                sx={{ flex: 1 }}
                                fontWeight={900}
                                fontSize={fieldsHeadersSize}
                            >
                                Stage:
                            </Typography>
                            <Typography
                                sx={{ flex: 1 }}
                                fontWeight={900}
                                fontSize={fieldsHeadersSize}
                            >
                                Status:
                            </Typography>
                        </Box>
                    }
                    {personalInfo.roundsQuantity > 0 && personalInfo.competitor &&
                        <Box
                            width={fieldsBoxWidth}
                            display='flex'
                            flexDirection='row'
                            alignItems='center'
                            justifyContent='space-between'
                        >
                            <Typography
                                sx={{ flex: 1 }}
                                fontStyle='italic'
                                fontSize={fieldsTextSize}
                            >
                                {personalInfo.stage}
                            </Typography>
                            <Typography
                                sx={{ flex: 1 }}
                                fontStyle='italic'
                                fontSize={fieldsTextSize}
                            >
                                {!personalInfo.out ? 'In' : 'Out'}
                            </Typography>
                        </Box>
                    }
                    {!(personalInfo.roundsQuantity > 0 && personalInfo.competitor) &&
                        <Box
                            width={fieldsBoxWidth}
                            display='flex'
                            flexDirection='row'
                            alignItems='center'
                            justifyContent='center'
                            gap={isNormalSize ? '2.5%' : '2%'}
                        >
                            <Typography
                                fontWeight={900}
                                fontSize={fieldsHeadersSize}
                            >
                                Participant:
                            </Typography>
                            {!isEditing &&
                                <Typography
                                    fontStyle='italic'
                                    fontSize={fieldsTextSize}
                                >
                                    {personalInfo.competitor ? 'Yes' : 'No'}
                                </Typography>
                            }
                            {isEditing &&
                                <TextField
                                    variant='standard'
                                    color='secondary'
                                    select
                                    value={personalInfoUpdated.competitor}
                                    onChange={(event) => setPersonalInfoUpdated({ ...personalInfoUpdated, competitor: event.target.value })}
                                >
                                    <MenuItem value={true} >Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </TextField>
                            }
                        </Box>
                    }
                    {personalInfo.publicRounds.length > 0 &&
                        <Typography
                            mt='1%'
                            variant={isNormalSize ? 'h5' : 'h6'}
                            fontStyle='italic'
                        >
                            Rounds
                        </Typography>
                    }
                    {personalInfo.publicRounds.length > 0 &&
                        <List
                            sx={{
                                width: '70%',
                                maxHeight: '42.5%',
                                overflow: 'auto'
                            }}
                            subheader={
                                <ListSubheader
                                    color='secondary'
                                    sx={{
                                        backgroundColor: '#f0f0f0',
                                        boxShadow: 7,
                                        py: isNormalSize ? '1%' : isMedium ? '1.5%' : '3.5%',
                                        px: isNormalSize ? '2%' : isMedium ? '3%' : '5%',
                                        m: isNormalSize ? '1%' : isMedium ? '1.5%' : '3.5%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Box
                                        display='flex'
                                        flexDirection='row'
                                        sx={{ flex: 1 }}
                                        alignItems='center'
                                    >
                                        <Typography
                                            align='left'
                                            fontWeight={900}
                                            fontSize={fieldsHeadersSize}
                                            sx={{ '&:hover': { cursor: 'pointer' }, }}
                                            onClick={() => sortState === 'stage_asc' ? setSortState('stage_desc') : sortState === 'stage_desc' ? setSortState('none') : setSortState('stage_asc')}
                                        >
                                            Stage
                                        </Typography>
                                        {sortState === 'stage_asc' && <NorthIcon fontSize='small' />}
                                        {sortState === 'stage_desc' && <SouthIcon fontSize='small' />}
                                    </Box>
                                    <Box
                                        display='flex'
                                        flexDirection='row'
                                        sx={{ flex: 5 }}
                                        justifyContent='center'
                                        alignItems='center'
                                    >
                                        <Typography
                                            align='center'
                                            fontWeight={900}
                                            fontSize={fieldsHeadersSize}
                                            sx={{ '&:hover': { cursor: 'pointer' }, }}
                                            onClick={() => sortState === 'opponent_asc' ? setSortState('opponent_desc') : sortState === 'opponent_desc' ? setSortState('none') : setSortState('opponent_asc')}
                                        >
                                            Opponent
                                        </Typography>
                                        {sortState === 'opponent_asc' && <NorthIcon fontSize='small' />}
                                        {sortState === 'opponent_desc' && <SouthIcon fontSize='small' />}
                                    </Box>
                                    <Box
                                        display='flex'
                                        flexDirection='row'
                                        sx={{ flex: 1 }}
                                        justifyContent='flex-end'
                                        alignItems='center'
                                    >
                                        {sortState === 'result_asc' && <NorthIcon fontSize='small' />}
                                        {sortState === 'result_desc' && <SouthIcon fontSize='small' />}
                                        <Typography
                                            align='right'
                                            fontWeight={900}
                                            fontSize={fieldsHeadersSize}
                                            sx={{ '&:hover': { cursor: 'pointer' }, }}
                                            onClick={() => sortState === 'result_asc' ? setSortState('result_desc') : sortState === 'result_desc' ? setSortState('none') : setSortState('result_asc')}
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
                                        py: isNormalSize ? '2%' : isMedium ? '2.5%' : '4.5%',
                                        px: isNormalSize ? '3%' : isMedium ? '3.5%' : '5.5%',
                                        m: isNormalSize ? '1%' : isMedium ? '1.5%' : '3.5%'
                                    }}
                                >
                                    <Typography
                                        fontSize={textInTableSize}
                                        align='left'
                                        sx={{ flex: 1 }}
                                    >
                                        {round.stage}
                                    </Typography>
                                    <Typography
                                        fontSize={textInTableSize}
                                        align='center'
                                        sx={{ flex: 5 }}
                                    >
                                        {findOpponent(round)}
                                    </Typography>
                                    <Typography
                                        fontSize={textInTableSize}
                                        align='right'
                                        sx={{ flex: 1 }}
                                    >
                                        {findResult(round)}
                                    </Typography>
                                </Card>
                            ))}
                        </List>}
                    <ChangePassword />
                </>
            }
            {loading && <CircularProgress color='secondary' />}
        </Box >
    );
}