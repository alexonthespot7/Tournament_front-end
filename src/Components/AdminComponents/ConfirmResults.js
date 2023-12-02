import { useContext } from "react";
import ContextWrapper from "../../context/ContextWrapper";
import { Button } from "@mui/material";
import Cookies from "js-cookie";

export default function ConfirmResults({ setLoading, fetchRoundsForm }) {

    const { windowSize, makeErrorAlert, makeSuccessAlert, makeWarningAlert, headerVariant, isNormalSize, size, deleteCookies } = useContext(ContextWrapper);

    const confirmResults = () => {
        if (window.confirm('Are you sure you want to confirm current stage results?')) {
            setLoading(true);
            fetchConfirmResults();
        }
    }

    const fetchConfirmResults = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/confirmresults`, {
                method: 'POST',
                headers: {
                    'Authorization': Cookies.get('jwt')
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    deleteCookies();
                    makeErrorAlert('Your session has expired. Please login again');
                } else if (response.status === 406) {
                    makeErrorAlert(await response.text());
                } else if (response.status === 403) {
                    makeErrorAlert(await response.text());
                    //redirect to main page
                } else {
                    makeErrorAlert(await response.text());
                }
            } else {
                fetchRoundsForm();
                makeSuccessAlert('Current stage results were successfully confirmed');
            }
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    return (
        <Button
            onClick={confirmResults}
            size={size}
            variant='contained'
            color='secondary'
        >
            Confirm results
        </Button>
    );
}