
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import { Box, Card, IconButton, List, ListItem, ListItemText, ListSubheader, Typography } from '@mui/material';
import { useState } from 'react';


const rounds = [
    {
        usernameOfCompetitor1: 'Alex',
        usernameOfCompetitor2: 'messi22822',
        stage: '1/2',
        result: 'Alex win'
    },
    {
        usernameOfCompetitor1: 'ferz',
        usernameOfCompetitor2: 'gigi',
        stage: '1/2',
        result: 'ferz win'
    },
    {
        usernameOfCompetitor1: 'Alex',
        usernameOfCompetitor2: 'shoes',
        stage: '1/4',
        result: 'Alex win'
    },
    {
        usernameOfCompetitor1: 'ferz',
        usernameOfCompetitor2: 'griixy',
        stage: '1/4',
        result: 'ferz win'
    },
    {
        usernameOfCompetitor1: null,
        usernameOfCompetitor2: 'messi228mmmmmmm',
        stage: '1/4',
        result: 'messi228mmmmmmm autowin'
    },
    {
        usernameOfCompetitor1: 'madaradanze',
        usernameOfCompetitor2: 'gigi',
        stage: '1/4',
        result: 'gigi win'
    },

];

export const findUsernameOfContestant = (username) => {
    return username ? username : '—';
}

export default function RoundsUser() {

    //state for sort handling
    const [sortState, setSortState] = useState('none');

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

    return (
        <Box sx={{ mt: 5 }} width='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center' height='90%' >
            <Typography variant="h4" sx={{ mb: 2 }}>
                Rounds
            </Typography>
            <List
                sx={{ width: '85%', maxHeight: '65%', overflow: 'auto' }}
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
                        <Box display='flex' flexDirection='row' sx={{ flex: 2 }} alignItems='center'>
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
                        <Box display='flex' flexDirection='row' sx={{ flex: 3 }} justifyContent='center' alignItems='center'>
                            <Typography
                                align='center'
                                fontWeight={900}
                                fontSize={20}
                                sx={{ '&:hover': { cursor: 'pointer' }, }}
                                onClick={() => sortState === 'contestant1_asc' ? setSortState('contestant1_desc') : sortState === 'contestant1_desc' ? setSortState('none') : setSortState('contestant1_asc')}
                            >
                                Contestant 1
                            </Typography>
                            {sortState === 'contestant1_asc' && <NorthIcon fontSize='small' />}
                            {sortState === 'contestant1_desc' && <SouthIcon fontSize='small' />}
                        </Box>
                        <Box display='flex' flexDirection='row' sx={{ flex: 3 }} justifyContent='center' alignItems='center'>
                            {sortState === 'contestant2_asc' && <NorthIcon fontSize='small' />}
                            {sortState === 'contestant2_desc' && <SouthIcon fontSize='small' />}
                            <Typography
                                align='center'
                                fontWeight={900}
                                fontSize={20}
                                sx={{ '&:hover': { cursor: 'pointer' }, }}
                                onClick={() => sortState === 'contestant2_asc' ? setSortState('contestant2_desc') : sortState === 'contestant2_desc' ? setSortState('none') : setSortState('contestant2_asc')}
                            >
                                Contestant 2
                            </Typography>
                        </Box>
                        <Box display='flex' flexDirection='row' sx={{ flex: 2 }} justifyContent='flex-end' alignItems='center'>
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
                        <Typography align='left' sx={{ flex: 2 }}>{round.stage} </Typography>
                        <Typography align='center' sx={{ flex: 3 }}>{findUsernameOfContestant(round.usernameOfCompetitor1)} </Typography>
                        <Typography align='center' sx={{ flex: 3 }}>{findUsernameOfContestant(round.usernameOfCompetitor2)} </Typography>
                        <Typography align='right' sx={{ flex: 2 }}>{round.result} </Typography>
                    </Card>
                ))}
            </List>
        </Box >
    );
}