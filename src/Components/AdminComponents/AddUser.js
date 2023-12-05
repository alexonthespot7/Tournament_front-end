import { useContext, useState } from 'react';

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';

const initialUserForm = {
    isCompetitor: false,
    username: '',
    email: '',
    password: '',
    role: 'USER',
    isVerified: false
}

export default function AddUser({ bracketMade, fetchUsersPageForm }) {
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [user, setUser] = useState({});

    const { makeBlackAlert, makeErrorAlert, makeSuccessAlert, isNormalSize, size, deleteCookies, checkResponseLength } = useContext(ContextWrapper);

    const navigate = useNavigate();

    const handleClickOpen = () => {
        setUser(initialUserForm);
        setOpenDialog(true);
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    const inputChanged = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
    }

    const handleSave = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        for (const key of Object.keys(user)) {
            if (user[key] === '') {
                makeBlackAlert(`${key} is mandatory`);
                return null;
            }
        }
        if (user.username.includes(' ')) {
            makeBlackAlert('Username must not include whitespaces');
        } else if (user.username.length > 15) {
            makeBlackAlert('The username must not be longer than 15 symbols');
        } else if (!emailPattern.test(user.email)) {
            makeBlackAlert('Please provide valid email');
        } else {
            setLoading(true);
            addUser();
        }
    }

    const addUser = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/adduser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('jwt')
                },
                body: JSON.stringify(user)
            });
            if (response.ok) {
                fetchUsersPageForm();
                setOpenDialog(false);
                setLoading(false);
                makeSuccessAlert('User was added successfully');
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
            <Button
                sx={{ fontSize: isNormalSize ? 14 : 11 }}
                size={size}
                onClick={handleClickOpen}
                color='secondary'
                variant='outlined'
            >
                Add user
            </Button>
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle>Add User</DialogTitle>
                {!loading &&
                    <>
                        <DialogContent>
                            <TextField
                                color='secondary'
                                size={size}
                                margin='dense'
                                name='username'
                                value={user.username}
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
                                value={user.email}
                                onChange={inputChanged}
                                label='Email'
                                fullWidth
                                variant='standard'
                            />
                            <TextField
                                color='secondary'
                                size={size}
                                fullWidth
                                margin='dense'
                                variant='standard'
                                type='password'
                                name='password'
                                onChange={inputChanged}
                                value={user.password}
                                label='Password'
                            />
                            <TextField
                                color='secondary'
                                size={size}
                                select
                                margin='dense'
                                name='role'
                                value={user.role}
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
                            {!bracketMade &&
                                <TextField
                                    color='secondary'
                                    size={size}
                                    select
                                    margin='dense'
                                    name='isCompetitor'
                                    value={user.isCompetitor}
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
                            <TextField
                                color='secondary'
                                size={size}
                                select
                                margin='dense'
                                name='isVerified'
                                value={user.isVerified}
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
                                onClick={handleSave}>
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