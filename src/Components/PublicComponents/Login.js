import { Box, Button, IconButton, InputAdornment, OutlinedInput, TextField, Typography } from "@mui/material";

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from "react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    return (
        <Box sx={{ mt: 20, mb: 6 }} display='flex' flexDirection='column' alignItems='center' justifyContent='flex-start' height='100%' width='45%'>
            <Typography variant="h4" sx={{ mb: 6 }}>
                Login
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '35%', textAlign: 'start' }}>
                <Typography>Username:</Typography>
                <TextField variant="outlined" placeholder="Enter your username" />
                <Typography>Password:</Typography>
                <OutlinedInput
                    sx={{ mb: 2 }}
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <Button variant="contained" color="secondary" style={{ width: '100%' }}>
                    Login
                </Button>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="text" color="secondary">
                        Sign Up
                    </Button>
                    <Button variant="text" color="secondary">
                        Forgot Password?
                    </Button>
                </div>

            </div>
        </Box>
    );
}