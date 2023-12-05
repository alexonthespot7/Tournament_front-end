import { useContext, useState } from 'react';

import { MenuItem, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';

export default function SetResult({ round, fetchRoundsForm, setLoading }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [roundUpdated, setRoundUpdated] = useState({});

    const { makeErrorAlert, makeSuccessAlert, isNormalSize, size, deleteCookies, checkResponseLength } = useContext(ContextWrapper);

    const navigate = useNavigate();

    const handleClickOpen = () => {
        setRoundUpdated(round);
        setOpenDialog(true);
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    const inputChanged = (event) => {
        setRoundUpdated({ ...roundUpdated, [event.target.name]: event.target.value });
    }

    const handleSave = () => {
        if (roundUpdated.result === round.result) {
            handleClose();
            makeSuccessAlert('Round result was saved');
        } else {
            setLoading(true);
            setResult();
        }
    }

    const setResult = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/setresult/${round.roundid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('jwt')
                },
                body: JSON.stringify(roundUpdated)
            });
            if (!response.ok) {
                if (response.status === 401) {
                    deleteCookies();
                    navigate('/login');
                    makeErrorAlert('Your session has expired. Please login again');
                } else if (response.status === 403) {
                    checkResponseLength(response);
                    navigate('/');
                } else if ([400, 409].includes(response.status)) {
                    checkResponseLength(response);
                    setLoading(false);
                } else if (response.status === 406) {
                    checkResponseLength(response);
                    fetchRoundsForm();
                }
            } else {
                fetchRoundsForm();
                makeSuccessAlert('The result for the round is set successfully');
            }
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    return (
        <div>
            <Button
                onClick={handleClickOpen}
                color='secondary'
                size='small'
                variant='contained'
            >
                Set Result
            </Button>
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle
                    fontSize={isNormalSize ? 20 : 17}
                >
                    Edit Round {round.roundid}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        color='secondary'
                        size={size}
                        margin='dense'
                        name='stage.stage'
                        value={round.stage.stage}
                        onChange={inputChanged}
                        label='Stage'
                        fullWidth
                        variant='standard'
                        disabled
                    />
                    <TextField
                        color='secondary'
                        size={size}
                        margin='dense'
                        name='user1.username'
                        value={round.user1.username}
                        onChange={inputChanged}
                        label='Contestant 1'
                        fullWidth
                        variant='standard'
                        disabled
                    />
                    <TextField
                        color='secondary'
                        size={size}
                        margin='dense'
                        name='user2.username'
                        value={round.user2.username}
                        onChange={inputChanged}
                        label='Contestant 2'
                        fullWidth
                        variant='standard'
                        disabled
                    />
                    <TextField
                        color='secondary'
                        size={size}
                        select
                        margin='dense'
                        name='result'
                        value={roundUpdated.result}
                        onChange={inputChanged}
                        label='Stage'
                        fullWidth
                        variant='standard'
                    >
                        <MenuItem value={round.user1.username + ' win'}>
                            {round.user1.username + ' win'}
                        </MenuItem>
                        <MenuItem value={round.user2.username + ' win'}>
                            {round.user2.username + ' win'}
                        </MenuItem>
                        <MenuItem value={'No'}>
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
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}