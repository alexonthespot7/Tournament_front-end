import { forwardRef, useEffect, useState } from "react";

import ContextWrapper from "./ContextWrapper";

import MuiAlert from '@mui/material/Alert';
import { Snackbar } from "@mui/material";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ContextProvider(props) {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const [alertText, setAlertText] = useState('');
    const [alertColor, setAlertColor] = useState('secondary');
    const [alertOpen, setAlertOpen] = useState(false);

    // Function to update window size state
    const updateWindowSize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }

    useEffect(() => {
        // Event listener for window resize
        window.addEventListener('resize', updateWindowSize);

        // Clean up the event listener when component unmounts
        return () => {
            window.removeEventListener('resize', updateWindowSize);
        };
    }, []); // Empty dependency array ensures this effect runs only once

    return (
        <ContextWrapper.Provider
            value={{
                windowSize, setAlertText, setAlertColor, setAlertOpen
            }}
        >
            {props.children}
            <Snackbar
                open={alertOpen}
                autoHideDuration={3000}
                onClose={() => setAlertOpen(false)}
            >
                <Alert
                    onClose={() => setAlertOpen(false)}
                    severity={alertColor}
                    sx={{ width: '100%' }}
                >
                    {alertText}
                </Alert>
            </Snackbar>
        </ContextWrapper.Provider>
    );
}

export default ContextProvider;