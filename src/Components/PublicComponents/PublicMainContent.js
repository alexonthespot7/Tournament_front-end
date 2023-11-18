import { Box, Button } from "@mui/material";

export default function PublicMainContent() {
    return (
        <Box display="flex" justifyContent="space-around" width="100%">
            <Button sx={{ transition: '0.35s', "&:hover": { backgroundColor: '#555555' } }} variant="contained" color="secondary">
                Login
            </Button>
            <Button sx={{ transition: '0.35s', "&:hover": { backgroundColor: '#b4b4b4' } }} variant="outlined" color="secondary">
                Signup
            </Button>
        </Box>
    );
}