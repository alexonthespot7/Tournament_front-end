
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import { Box, Card, IconButton, List, ListItem, ListItemText, ListSubheader, Typography } from '@mui/material';
import { useState } from 'react';


const competitors = [
    {
        username: 'Alex',
        isOut: false,
        stage: '1/2'
    },
    {
        username: 'Anto',
        isOut: false,
        stage: '1/2'
    },
    {
        username: 'Maessy',
        isOut: false,
        stage: '1/2'
    },
    {
        username: 'Menet',
        isOut: false,
        stage: '1/2'
    },
    {
        username: 'Greedy',
        isOut: true,
        stage: '1/4'
    },
    {
        username: 'Dizzy',
        isOut: true,
        stage: '1/4'
    },
    {
        username: 'Maessy',
        isOut: false,
        stage: '1/2'
    },
    {
        username: 'Menet',
        isOut: false,
        stage: '1/2'
    },
    {
        username: 'Greedy',
        isOut: true,
        stage: '1/4'
    },
    {
        username: 'asdt',
        isOut: true,
        stage: '1/4'
    },
    {
        username: 'Maessy',
        isOut: false,
        stage: '1/2'
    },
    {
        username: 'Menet',
        isOut: false,
        stage: '1/2'
    },
    {
        username: 'Greedy',
        isOut: true,
        stage: '1/4'
    },
    {
        username: 'Dizzy',
        isOut: true,
        stage: '1/4'
    },
    {
        username: 'Dizzy',
        isOut: true,
        stage: 'final'
    },

];

export default function Competitors() {

    //state for sort handling
    const [sortState, setSortState] = useState('none');

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
        status_asc: { method: (a, b) => a.isOut - b.isOut },
        status_desc: { method: (a, b) => b.isOut - a.isOut }
    }

    const filteredCompetitors = competitors.sort(sortMethods[sortState].method);

    return (
        <Box sx={{ mt: 5 }} width='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center' height='90%' >
            <Typography variant="h4" sx={{ mb: 2 }}>
                Competitors
            </Typography>
            <List
                subheader={<ListSubheader color='secondary' sx={{ backgroundColor: '#f0f0f0', boxShadow: 7, py: '1%', px: '2%', m: '1%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
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
                            onClick={() => sortState === 'username_asc' ? setSortState('username_desc') : sortState === 'username_desc' ? setSortState('none') : setSortState('username_asc')}
                        >
                            Username
                        </Typography>
                        {sortState === 'username_asc' && <NorthIcon fontSize='small' />}
                        {sortState === 'username_desc' && <SouthIcon fontSize='small' />}
                    </Box>
                    <Box display='flex' flexDirection='row' sx={{ flex: 1 }} justifyContent='flex-end' alignItems='center'>
                        {sortState === 'status_asc' && <NorthIcon fontSize='small' />}
                        {sortState === 'status_desc' && <SouthIcon fontSize='small' />}
                        <Typography
                            align='right'
                            fontWeight={900}
                            fontSize={20}
                            sx={{ '&:hover': { cursor: 'pointer' }, }}
                            onClick={() => sortState === 'status_asc' ? setSortState('status_desc') : sortState === 'status_desc' ? setSortState('none') : setSortState('status_asc')}
                        >
                            Status
                        </Typography>
                    </Box>
                </ListSubheader>}
                sx={{ width: '70%', maxHeight: '65%', overflow: 'auto' }}
            >
                {filteredCompetitors.map((competitor, index) => (
                    <Card key={index} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', py: '2%', px: '3%', m: '1%' }}>
                        <Typography align='left' sx={{ flex: 1 }}>{competitor.stage} </Typography>
                        <Typography align='center' sx={{ flex: 5 }}>{competitor.username} </Typography>
                        <Typography align='right' sx={{ flex: 1 }}>{competitor.isOut ? 'Out' : 'In'} </Typography>
                    </Card>
                ))}
            </List>
        </Box >
    );
}