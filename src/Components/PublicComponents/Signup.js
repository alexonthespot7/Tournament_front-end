import { Box, Button, IconButton, InputAdornment, OutlinedInput, TextField, Typography } from "@mui/material";

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from "react";

export default function Signup() {

    return (
        <Box sx={{ mt: 22, mb: 6 }} display='flex' flexDirection='column' alignItems='center' justifyContent='flex-start' height='100%' width='45%'>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Signup
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '35%', textAlign: 'start' }}>
                <TextField error={false} helperText='' variant="outlined" label='Username' />
                <TextField error={false} helperText='' variant="outlined" label='Email' />
                <TextField error={false} helperText='' variant="outlined" type='password' label='Password' />
                <TextField error={false} helperText='' variant="outlined" type='password' label='Repeat password' />
                <Button variant="contained" color="secondary" style={{ width: '100%' }}>
                    Sign-up
                </Button>
            </div>
        </Box>
    );
}