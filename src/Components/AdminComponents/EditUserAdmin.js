import { useContext, useState } from 'react';

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';

import { useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';

export default function EditUserAdmin({ fetchUsersPageForm, user, bracketMade }) {
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [userUpdated, setUserUpdated] = useState({});

    const { makeErrorAlert, makeSuccessAlert, makeBlackAlert, isNormalSize, size, deleteCookies, checkResponseLength } = useContext(ContextWrapper);

    const navigate = useNavigate();

    const handleClickOpen = () => {
        setUserUpdated(user);
        setOpenDialog(true);
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    const inputChanged = (event) => {
        setUserUpdated({ ...userUpdated, [event.target.name]: event.target.value });
    }

    const handleSave = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        for (const key of Object.keys(userUpdated)) {
            if (userUpdated[key] === '') {
                makeBlackAlert(`${key} is mandatory`);
                return null;
            }
        }
        if (userUpdated.username.includes(' ')) {
            makeBlackAlert('Username must not include whitespaces');
        } else if (userUpdated.username.length > 15) {
            makeBlackAlert('The username must not be longer than 15 symbols');
        } else if (!emailPattern.test(userUpdated.email)) {
            makeBlackAlert('Please provide valid email');
        } else {
            setLoading(true);
            editUser();
        }
    }

    const editUser = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/updateuser/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('jwt')
                },
                body: JSON.stringify(userUpdated)
            });
            if (response.ok) {
                fetchUsersPageForm();
                setOpenDialog(false);
                setLoading(false);
                makeSuccessAlert('User was updated successfully');
            } else if (response.status === 401) {
                checkResponseLength(response);
                deleteCookies();
                navigate('/login');
            } else if (response.status === 403) {
                checkResponseLength(response);
                navigate('/');
            } else {
                setLoading(false);
                checkResponseLength(response);
            }
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    return (
        <>
            <IconButton
                size={size}
                onClick={handleClickOpen}
            >
                <EditIcon fontSize={size} color='secondary' />
            </IconButton>
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle fontSize={isNormalSize ? 20 : 17}>Edit User {user.id}</DialogTitle>
                {!loading &&
                    <>
                        <DialogContent>
                            <TextField
                                color='secondary'
                                size={size}
                                margin='dense'
                                name='username'
                                value={userUpdated.username}
                                onChange={inputChanged}
                                label='Username'
                                fullWidth
                                variant='standard'
                            />
                            <TextField
                                color='secondary'
                                size={size}
                                margin='dense'
                                name='email'
                                value={userUpdated.email}
                                onChange={inputChanged}
                                label='Email'
                                fullWidth
                                variant='standard'
                            />
                            {user.role !== 'ADMIN' &&
                                <TextField
                                    color='secondary'
                                    size={size}
                                    select
                                    margin='dense'
                                    name='role'
                                    value={userUpdated.role}
                                    onChange={inputChanged}
                                    label='Role'
                                    fullWidth
                                    variant='standard'
                                >
                                    <MenuItem value={'ADMIN'}>
                                        ADMIN
                                    </MenuItem>
                                    <MenuItem value={'USER'}>
                                        USER
                                    </MenuItem>
                                </TextField>
                            }
                            {!bracketMade &&
                                <TextField
                                    color='secondary'
                                    size={size}
                                    select
                                    margin='dense'
                                    name='isCompetitor'
                                    value={userUpdated.isCompetitor}
                                    onChange={inputChanged}
                                    label='Participant?'
                                    fullWidth
                                    variant='standard'
                                >
                                    <MenuItem value={true}>
                                        Yes
                                    </MenuItem>
                                    <MenuItem value={false}>
                                        No
                                    </MenuItem>
                                </TextField>
                            }
                            {!user.accountVerified &&
                                <TextField
                                    color='secondary'
                                    size={size}
                                    select
                                    margin='dense'
                                    name='accountVerified'
                                    value={userUpdated.accountVerified}
                                    onChange={inputChanged}
                                    label='Verified?'
                                    fullWidth
                                    variant='standard'
                                >
                                    <MenuItem value={true}>
                                        Yes
                                    </MenuItem>
                                    <MenuItem value={false}>
                                        No
                                    </MenuItem>
                                </TextField>
                            }
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color='secondary'
                                size={size}
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant='contained'
                                color='secondary'
                                size={size}
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                        </DialogActions>
                    </>
                }
                {loading &&
                    <Box
                        height='100%'
                        width='100%'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                    >
                        <CircularProgress color='secondary' />
                    </Box>
                }
            </Dialog>
        </>
    );
}