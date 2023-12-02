import { useContext, useState } from 'react';

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

import ContextWrapper from '../../context/ContextWrapper';

const initialEmailForm = { email: '' }

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [emailForm, setEmailForm] = useState(initialEmailForm);

    const {
        makeErrorAlert, makeBlackAlert,
        makeSuccessAlert, size
    } = useContext(ContextWrapper);

    const handleClickOpen = () => {
        setEmailForm(initialEmailForm);
        setOpenDialog(true);
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    const inputChanged = (event) => {
        setEmailForm({ ...emailForm, [event.target.name]: event.target.value });
    }

    const handleSave = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailForm.email === '') {
            makeBlackAlert('Email is mandatory');
        } else if (!emailPattern.test(emailForm.email)) {
            makeBlackAlert('Please provide valid email');
        } else {
            setLoading(true)
            resetPassword();
        }
    }

    const resetPassword = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/resetpassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailForm)
            });

            if (response.ok) {
                handleClose();
                makeSuccessAlert('A temporary password was sent to your email address');
            } else {
                setLoading(false);
                makeErrorAlert(await response.text());
            }
        } catch (error) {
            makeErrorAlert('Can\'t reach the server at the moment');
        }
    }

    return (
        <>
            <Button
                onClick={handleClickOpen}
                size={size}
                variant='text'
                color='secondary'
            >
                Forgot Password?
            </Button>
            <Dialog
                open={openDialog}
                onClose={handleClose}
                fullWidth
            >
                <DialogTitle>Reset Password</DialogTitle>
                {!loading &&
                    <>
                        <DialogContent>
                            <TextField
                                color='secondary'
                                size={size}
                                margin='dense'
                                name='email'
                                value={emailForm.email}
                                onChange={inputChanged}
                                label='Email'
                                fullWidth
                                variant='standard'
                            />
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