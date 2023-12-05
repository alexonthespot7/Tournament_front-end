import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { useContext, useEffect, useState } from 'react';

import { Box, CircularProgress, Typography } from '@mui/material';

import FlagIcon from '@mui/icons-material/Flag';

import { AgGridReact } from 'ag-grid-react';

import { useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';

export default function Stages() {
    const [loading, setLoading] = useState(true);
    const [stages, setStages] = useState([]);

    const { makeErrorAlert, makeWarningAlert, headerVariant, isNormalSize, deleteCookies, checkResponseLength } = useContext(ContextWrapper);

    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('role') === 'ADMIN') {
            fetchStages();
        } else {
            navigate('/');
            makeWarningAlert('You don\'t have permission to access this page');
        }
    }, []);

    const fetchStages = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/stages`, {
                method: 'GET',
                headers: { 'Authorization': Cookies.get('jwt') }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    deleteCookies();
                    navigate('/login');
                    makeErrorAlert('Your session has expired, login again please');
                } else if (response.status === 403) {
                    checkResponseLength(response);
                    navigate('/');
                } else {
                    checkResponseLength(response);
                }
                return null;
            }

            response.json()
                .then(data => {
                    setStages(data);
                    setLoading(false);
                })
                .catch(err => makeErrorAlert(err.message));
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    const columnDefs = [
        { headerName: 'Stage', field: 'stage' },
        { cellRenderer: params => { return params.value ? <FlagIcon /> : <></> }, headerName: 'Current', field: 'isCurrent' },
    ];

    return (
        <Box
            sx={{ mt: '8%' }}
            width='100%'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            height='90%'
        >
            {!loading &&
                <>
                    <Typography
                        variant={headerVariant}
                        sx={{ mb: '2%' }}
                    >
                        Stages
                    </Typography>
                    <div
                        className='ag-theme-quartz'
                        style={{
                            width: isNormalSize ? '50%' : '90%',
                            height: '65%',
                        }}
                    >
                        <AgGridReact
                            rowData={stages}
                            columnDefs={columnDefs}
                            defaultColDef={{
                                resizable: true,
                                filter: true,
                                sortable: true,
                                cellStyle: { 'textAlign': 'left' }
                            }}
                            animateRows={true}
                        />
                    </div>
                </>
            }
            {loading && <CircularProgress color='secondary' />}
        </Box>
    );
}