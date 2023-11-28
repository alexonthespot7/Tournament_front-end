import { MenuItem, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

export default function SetResult({ round }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [roundUpdated, setRoundUpdated] = useState({});
    const handleClickOpen = () => {
        setRoundUpdated(round);
        setOpenDialog(true);
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    const inputChanged = () => { }

    const handleSave = () => { }

    return (
        <div>
            <Button onClick={handleClickOpen} color='secondary' size='small' variant='contained'>
                Set Result
            </Button>
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle>Edit Round {round.roundid}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name='stage.stage'
                        value={round.stage.stage}
                        onChange={inputChanged}
                        label='Stage'
                        fullWidth
                        variant="standard"
                        disabled
                    />
                    <TextField
                        margin="dense"
                        name='user1.username'
                        value={round.user1.username}
                        onChange={inputChanged}
                        label='Contestant 1'
                        fullWidth
                        variant="standard"
                        disabled
                    />
                    <TextField
                        margin="dense"
                        name='user2.username'
                        value={round.user2.username}
                        onChange={inputChanged}
                        label='Contestant 2'
                        fullWidth
                        variant="standard"
                        disabled
                    />
                    <TextField
                        select
                        margin="dense"
                        name='result'
                        value={roundUpdated.result}
                        onChange={inputChanged}
                        label='Stage'
                        fullWidth
                        variant="standard"
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
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}