import EditIcon from '@mui/icons-material/Edit';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField } from '@mui/material';
import { useState } from 'react';

export default function EditUserAdmin({ user, bracketMade }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [userUpdated, setUserUpdated] = useState({});
    const handleClickOpen = () => {
        setUserUpdated(user);
        setOpenDialog(true);
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    const inputChanged = () => { }

    const handleSave = () => { }

    return (
        <>
            <IconButton onClick={handleClickOpen}>
                <EditIcon color='secondary' />
            </IconButton>
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle>Edit User {user.id}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name='username'
                        value={userUpdated.username}
                        onChange={inputChanged}
                        label='Username'
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name='email'
                        value={userUpdated.email}
                        onChange={inputChanged}
                        label='Email'
                        fullWidth
                        variant="standard"
                    />
                    {user.role !== 'ADMIN' &&
                        <TextField
                            select
                            margin="dense"
                            name='role'
                            value={userUpdated.role}
                            onChange={inputChanged}
                            label='Role'
                            fullWidth
                            variant="standard"
                        >
                            <MenuItem value={'ADMIN'}>
                                ADMIN
                            </MenuItem>
                            <MenuItem value={'USER'}>
                                USER
                            </MenuItem>
                        </TextField>
                    }
                    {!(user.isCompetitor && bracketMade) &&
                        <TextField
                            select
                            margin="dense"
                            name='isCompetitor'
                            value={userUpdated.isCompetitor}
                            onChange={inputChanged}
                            label='Participant?'
                            fullWidth
                            variant="standard"
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
                            select
                            margin="dense"
                            name='accountVerified'
                            value={userUpdated.accountVerified}
                            onChange={inputChanged}
                            label='Verified?'
                            fullWidth
                            variant="standard"
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
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}