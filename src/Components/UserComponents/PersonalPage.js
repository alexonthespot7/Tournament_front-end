import { Box, Card, IconButton, List, ListSubheader, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";

const personalInfo = {
    username: 'alexonthespot',
    email: 'shevelenkov.aa@edu.spbstu.ru',
    isOut: false,
    stage: '1/2',
    isCompetitor: true,
    roundsQuantity: 2,
    publicRounds: [
        {
            usernameOfCompetitor1: 'alexonthespot',
            usernameOfCompetitor2: 'Messi2281',
            stage: '1/8',
            result: 'Alex win'
        },
        {
            usernameOfCompetitor1: 'alexonthespot',
            usernameOfCompetitor2: 'Messi2281',
            stage: '1/8',
            result: 'Alex win'
        },
        {
            usernameOfCompetitor1: 'alexonthespot',
            usernameOfCompetitor2: 'Messi2281',
            stage: '1/8',
            result: 'Alex win'
        },
        {
            usernameOfCompetitor1: 'alexonthespot',
            usernameOfCompetitor2: 'Messi2281',
            stage: '1/8',
            result: 'Alex win'
        }
    ]
}

export default function PersonalPage() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <Box sx={{ mt: '4%' }} gap='2.5%' width='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center' height='90%' >
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
                            >
                                Stage
                            </Typography>
                        </Box>
                        <Box display='flex' flexDirection='row' sx={{ flex: 5 }} justifyContent='center' alignItems='center'>
                            <Typography
                                align='center'
                                fontWeight={900}
                                fontSize={20}
                                sx={{ '&:hover': { cursor: 'pointer' }, }}
                            >
                                Opponent
                            </Typography>
                        </Box>
                        <Box display='flex' flexDirection='row' sx={{ flex: 1 }} justifyContent='flex-end' alignItems='center'>
                            <Typography
                                align='right'
                                fontWeight={900}
                                fontSize={20}
                                sx={{ '&:hover': { cursor: 'pointer' }, }}
                            >
                                Result
                            </Typography>
                        </Box>
                    </ListSubheader>}
            >
                {personalInfo.publicRounds.map((round, index) => (
                    <Card key={index} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', py: '2%', px: '3%', m: '1%' }}>
                        <Typography align='left' sx={{ flex: 1 }}>{round.stage} </Typography>
                        <Typography align='center' sx={{ flex: 5 }}>{round.usernameOfCompetitor1 === personalInfo.username ? round.usernameOfCompetitor2 : round.usernameOfCompetitor1} </Typography>
                        <Typography align='right' sx={{ flex: 1 }}>{round.result} </Typography>
                    </Card>
                ))}
            </List>}
        </Box >
    );
}