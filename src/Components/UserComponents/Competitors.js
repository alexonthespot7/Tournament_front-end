import { useContext, useEffect, useState } from 'react';

import { Box, Card, CircularProgress, List, ListSubheader, Typography } from '@mui/material';

import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';


//different sorting cases
const sortMethods = {
    none: { method: () => null },
    username_asc: { method: (a, b) => a.username.localeCompare(b.username) },
    username_desc: { method: (a, b) => b.username.localeCompare(a.username) },

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
    status_asc: { method: (a, b) => a.out - b.out },
    status_desc: { method: (a, b) => b.out - a.out }
}

export default function Competitors() {
    const [loading, setLoading] = useState(true);
    const [competitors, setCompetitors] = useState([]);

    //state for sort handling
    const [sortState, setSortState] = useState('none');

    const { windowSize, makeErrorAlert, headerVariant, isNormalSize, deleteCookies, checkResponseLength } = useContext(ContextWrapper);

    // Variables for making size responsible, depending on the screen size;
    const listHeadersSize = isNormalSize ? 20 : 17;
    const listTextSize = isNormalSize ? 16 : 14;

    const isMedium = windowSize.width > 600;

    const boxWidth = isMedium ? '70%' : '85%';

    // This way the percentage grows inversely to the screen height
    const indentPercentageCalculator = (initialPercentage) => {
        return `${initialPercentage + 705600 / Math.pow(windowSize.height, 2)}%`;
    }

    //this way the bigger the initial percentage is, the lesser the multiplier is
    //the multiplier is used to increase margin and padding as the screen size decreases. 
    const sizePercentageCalculator = (initialPercentage) => {
        return isNormalSize ? `${initialPercentage}%` : isMedium ? `${initialPercentage * (2.5 / initialPercentage)}%` : `${initialPercentage * (4 / initialPercentage)}%`;
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/competitors`, {
                method: 'GET',
                headers: { 'Authorization': Cookies.get('jwt') }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    deleteCookies();
                    makeErrorAlert('Your session has expired, login again please');
                } else {
                    checkResponseLength(response);
                }
                return null;
            }

            response.json()
                .then(data => {
                    setCompetitors(data);
                    setLoading(false);
                })
                .catch(err => makeErrorAlert(err.message));
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    const filteredCompetitors = competitors.sort(sortMethods[sortState].method);

    const sortField = (field) => {
        const fieldAsc = `${field}_asc`;
        const fieldDesc = `${field}_desc`;
        sortState === fieldAsc
            ? setSortState(fieldDesc)
            : sortState === fieldDesc
                ? setSortState('none')
                : setSortState(fieldAsc);
    }

    return (
        <Box
            sx={{ mt: indentPercentageCalculator(1.5) }}
            width='100%'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            height='90%'
        >
            {!loading &&
                <>
                    <Typography variant={headerVariant} sx={{ mb: indentPercentageCalculator(1) }}>
                        Competitors
                    </Typography>
                    <List
                        sx={{
                            width: boxWidth,
                            maxHeight: '65%',
                            overflow: 'auto'
                        }}
                        subheader={
                            <ListSubheader
                                color='secondary'
                                sx={{
                                    backgroundColor: '#f0f0f0',
                                    boxShadow: 8,
                                    py: sizePercentageCalculator(1),
                                    px: sizePercentageCalculator(2),
                                    m: sizePercentageCalculator(1),
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
                                        fontSize={listHeadersSize}
                                        sx={{ '&:hover': { cursor: 'pointer' } }}
                                        onClick={() => sortField('stage')}
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
                                        fontSize={listHeadersSize}
                                        sx={{ '&:hover': { cursor: 'pointer' } }}
                                        onClick={() => sortField('username')}
                                    >
                                        Username
                                    </Typography>
                                    {sortState === 'username_asc' && <NorthIcon fontSize='small' />}
                                    {sortState === 'username_desc' && <SouthIcon fontSize='small' />}
                                </Box>
                                <Box
                                    display='flex'
                                    flexDirection='row'
                                    sx={{ flex: 1 }}
                                    justifyContent='flex-end'
                                    alignItems='center'
                                >
                                    {sortState === 'status_asc' && <NorthIcon fontSize='small' />}
                                    {sortState === 'status_desc' && <SouthIcon fontSize='small' />}
                                    <Typography
                                        align='right'
                                        fontWeight={900}
                                        fontSize={listHeadersSize}
                                        sx={{ '&:hover': { cursor: 'pointer' } }}
                                        onClick={() => sortField('status')}
                                    >
                                        Status
                                    </Typography>
                                </Box>
                            </ListSubheader>}
                    >
                        {filteredCompetitors.map((competitor, index) => (
                            <Card
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    py: sizePercentageCalculator(2),
                                    px: sizePercentageCalculator(3),
                                    m: sizePercentageCalculator(1)
                                }}
                            >
                                <Typography
                                    fontSize={listTextSize}
                                    align='left'
                                    sx={{ flex: 1 }}
                                >
                                    {competitor.stage}
                                </Typography>
                                <Typography
                                    fontSize={listTextSize}
                                    align='center'
                                    sx={{ flex: 5 }}
                                >
                                    {competitor.username}
                                </Typography>
                                <Typography
                                    fontSize={listTextSize}
                                    align='right'
                                    sx={{ flex: 1 }}
                                >
                                    {competitor.out ? 'Out' : 'In'}
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