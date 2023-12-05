import { forwardRef, useEffect, useState } from 'react';

import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import Cookies from 'js-cookie';

import ContextWrapper from './ContextWrapper';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

function ContextProvider(props) {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const [alertText, setAlertText] = useState('');
    const [alertColor, setAlertColor] = useState('secondary');
    const [alertOpen, setAlertOpen] = useState(false);

    //Sometimes the server returns technical text as response.text() value. In that case the text shouldn't be placed in snackbar;
    const checkResponseLength = async (response) => {
        const responseText = await response.text();
        if (responseText.length > 200) {
            makeErrorAlert('Something wrong with the server');
        } else {
            makeErrorAlert(responseText);
        }
    }

    const invokeAlert = (text, color) => {
        setAlertOpen(true);
        setAlertColor(color);
        setAlertText(text);
    }

    const makeErrorAlert = (text) => {
        invokeAlert(text, 'error');
    }

    const makeBlackAlert = (text) => {
        invokeAlert(text, 'secondary');
    }

    const makeWarningAlert = (text) => {
        invokeAlert(text, 'warning');
    }

    const makeSuccessAlert = (text) => {
        invokeAlert(text, 'success');
    }

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
    }, []);

    //the variable will be used for conditional rendering to make design responsive
    const isNormalSize = (windowSize.width > 900 && windowSize.height > 475);

    const headerVariant = isNormalSize ? 'h4' : 'h5';
    const size = isNormalSize ? 'medium' : 'small';

    const deleteCookies = () => {
        Cookies.remove('jwt');
        Cookies.remove('role');
        Cookies.remove('userId');
        Cookies.remove('username');
    }

    return (
        <ContextWrapper.Provider
            value={{
                windowSize, makeErrorAlert, makeBlackAlert,
                makeWarningAlert, makeSuccessAlert, headerVariant,
                size, isNormalSize, deleteCookies, checkResponseLength
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