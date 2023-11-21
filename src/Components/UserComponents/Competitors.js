
import Paper from '@mui/material/Paper';
import { Box, Card, List, ListItem, ListItemText, ListSubheader, Typography } from '@mui/material';


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
        username: 'Dizzy',
        isOut: true,
        stage: '1/4'
    },

];

export default function Competitors() {

    return (
        <Box sx={{ mt: 5 }} width='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center' height='90%' >
            <Typography variant="h4" sx={{ mb: 2 }}>
                Competitors
            </Typography>
            <List
                subheader={<ListSubheader color='secondary' sx={{ backgroundColor: '#f0f0f0', boxShadow: 7, py: '1%', px: '2%', m: '1%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography align='left' sx={{ flex: 1 }} fontWeight={900} fontSize={20}>Stage</Typography>
                    <Typography align='center' sx={{ flex: 10 }} fontWeight={900} fontSize={20}>Username</Typography>
                    <Typography align='right' sx={{ flex: 1 }} fontWeight={900} fontSize={20}>Status</Typography>
                </ListSubheader>}
                sx={{ width: '70%', maxHeight: '65%', overflow: 'auto' }}
            >
                {competitors.map((competitor, index) => (
                    <Card key={index} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', py: '2%', px: '3%', m: '1%' }}>
                        <Typography align='left' sx={{ flex: 1 }}>{competitor.stage} </Typography>
                        <Typography align='center' sx={{ flex: 10 }}>{competitor.username} </Typography>
                        <Typography align='right' sx={{ flex: 1 }}>{competitor.isOut ? 'Out' : 'In'} </Typography>
                    </Card>
                ))}
            </List>
        </Box >
    );
}