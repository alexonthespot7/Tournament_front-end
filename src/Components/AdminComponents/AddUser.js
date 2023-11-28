import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import { useState } from "react";

export default function AddUser({ bracketMade }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [user, setUser] = useState({});

    const handleClickOpen = () => {
        setOpenDialog(true);
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    const inputChanged = () => { }

    const handleSave = () => { }
    return (
        <>
            <Button onClick={handleClickOpen} color='secondary' variant='outlined'>
                Add user
            </Button>
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle>Add User</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name='username'
                        value={user.username}
                        onChange={inputChanged}
                        label='Username'
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name='email'
                        value={user.email}
                        onChange={inputChanged}
                        label='Email'
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        error={false}
                        helperText=''
                        variant="standard"
                        type='password'
                        name='password'
                        value={user.password}
                        label='Password'
                    />
                    <TextField
                        select
                        margin="dense"
                        name='role'
                        value={user.role}
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
                    {!bracketMade &&
                        <TextField
                            select
                            margin="dense"
                            name='isCompetitor'
                            value={user.isCompetitor}
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
                    <TextField
                        select
                        margin="dense"
                        name='isVerified'
                        value={user.isVerified}
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}