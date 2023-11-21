import { Box, Button } from "@mui/material";
import { useState } from "react";

export default function UserMainContent() {
    const [isBracketMade, setIsBracketMade] = useState(true);

    return (
        <Box display='flex' flexDirection='column' gap={10} width="100%">
            <Box display="flex" justifyContent="space-around" width="100%">
                <Button sx={{ transition: '0.35s', "&:hover": { backgroundColor: '#555555' } }} variant="contained" color="secondary">
                    Competitors
                </Button>
                <Button sx={{ transition: '0.35s', "&:hover": { backgroundColor: '#b4b4b4' } }} variant="outlined" color="secondary">
                    Personal page
                </Button>
            </Box>
            {isBracketMade && <Box display="flex" justifyContent="space-around" width="100%">
                <Button sx={{ transition: '0.35s', "&:hover": { backgroundColor: '#b4b4b4' } }} variant="outlined" color="secondary">
                    Rounds
                </Button>
                <Button sx={{ transition: '0.35s', "&:hover": { backgroundColor: '#555555' } }} variant="contained" color="secondary">
                    Bracket
                </Button>
            </Box>}
        </Box>
    );
}