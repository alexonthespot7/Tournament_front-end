import { useContext, useState } from 'react';

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

import ContextWrapper from '../../context/ContextWrapper';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const initialPasswordForm = {
    oldPassword: '',
    newPassword: '',
}

export default function ChangePassword() {
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [passwordForm, setPasswordForm] = useState({});
    const [repeatPassword, setRepeatPassword] = useState('');

    const {
        makeErrorAlert, makeBlackAlert,
        makeSuccessAlert, isNormalSize, size, deleteCookies
    } = useContext(ContextWrapper);

    const navigate = useNavigate();

    const handleClickOpen = () => {
        setPasswordForm(initialPasswordForm);
        setRepeatPassword('');
        setOpenDialog(true);
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    const inputChanged = (event) => {
        setPasswordForm({ ...passwordForm, [event.target.name]: event.target.value });
    }

    const handleSave = () => {
        if (passwordForm.newPassword === '' || passwordForm.newPassword === '') {
            makeBlackAlert('Please fill in all fields');
        } else if (repeatPassword !== passwordForm.newPassword) {
            makeBlackAlert('Passwords must match');
        } else {
            setLoading(true);
            changePassword();
        }
    }

    const changePassword = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/changepassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('jwt')
                },
                body: JSON.stringify(passwordForm)
            });
            if (!response.ok) {
                if (response.status === 401) {
                    deleteCookies();
                    navigate('/login');
                    makeErrorAlert('Your session has expired. Please login again');
                } else {
                    makeErrorAlert(await response.text());
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setOpenDialog(false);
                makeSuccessAlert('Your password was updated successfully');
            }
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    return (
        <>
            <Button
                color='secondary'
                size={size}
                variant='outlined'
                sx={{
                    boxShadow: 8,
                    position: 'fixed',
                    right: '3%',
                    bottom: '4%',
                    transition: '0.35s',
                    '&:hover': { backgroundColor: '#b4b4b4' }
                }}
                onClick={handleClickOpen}
            >
                Change password
            </Button>
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle fontSize={isNormalSize ? 20 : 17}>Change password</DialogTitle>
                {!loading &&
                    <>
                        <DialogContent>
                            <TextField
                                size={size}
                                type='password'
                                color='secondary'
                                margin='dense'
                                name='oldPassword'
                                value={passwordForm.oldPassword}
                                onChange={inputChanged}
                                label='Old Password'
                                fullWidth
                                variant='outlined'
                            />
                            <TextField
                                size={size}
                                type='password'
                                color='secondary'
                                margin='dense'
                                name='newPassword'
                                value={passwordForm.newPassword}
                                onChange={inputChanged}
                                label='New Password'
                                fullWidth
                                variant='outlined'
                            />
                            <TextField
                                size={size}
                                type='password'
                                color='secondary'
                                margin='dense'
                                name='repeatPassword'
                                value={repeatPassword}
                                onChange={(event) => setRepeatPassword(event.target.value)}
                                label='Repeat Password'
                                fullWidth
                                variant='outlined'
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                size={size}
                                variant='outlined'
                                color='secondary'
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                size={size}
                                variant='contained'
                                color='secondary'
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                        </DialogActions>
                    </>
                }
                {loading &&
                    <Box width='100%' height='100%' m={15}>
                        <CircularProgress color='secondary' />
                    </Box>
                }
            </Dialog>
        </>
    );
}