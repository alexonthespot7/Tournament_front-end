import { useContext, useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import SetResult from './SetResult';
import Cookies from 'js-cookie';
import ContextWrapper from '../../context/ContextWrapper';
import ConfirmResults from './ConfirmResults';
import { useNavigate } from 'react-router-dom';

export const findUsernameOfContestant = (username) => {
    return username ? username : '—';
}

export default function RoundsAdmin() {
    const [loading, setLoading] = useState(true);
    const [roundsFormAdmin, setRoundsFormAdmin] = useState(null);

    const { makeErrorAlert, makeWarningAlert, headerVariant, isNormalSize, deleteCookies } = useContext(ContextWrapper);

    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('role') === 'ADMIN') {
            fetchRoundsForm();
        } else {
            navigate('/');
            makeWarningAlert('You don\'t have permission to access this page');
        }
    }, []);

    const fetchRoundsForm = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/rounds`, {
                method: 'GET',
                headers: { 'Authorization': Cookies.get('jwt') }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    deleteCookies();
                    navigate('/login');
                    makeErrorAlert('Your session has expired, login again please');
                } else if (response.status === 403) {
                    makeErrorAlert(await response.text());
                    navigate('/');
                } else {
                    makeErrorAlert(await response.text());
                }
                return null;
            }
            if (response.status === 202) {
                makeErrorAlert('The bracket was not made yet');
                navigate('/');
                return null;
            }

            response.json()
                .then(data => {
                    setRoundsFormAdmin(data);
                    setLoading(false);
                })
                .catch(err => makeErrorAlert(err.message));
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    const columnDefs = [
        { headerName: 'Stage', field: 'stage.stage' },
        { valueFormatter: params => { return params.value ? params.value : '-' }, headerName: 'Contestant 1', field: 'user1.username' },
        { valueFormatter: params => { return params.value ? params.value : '-' }, headerName: 'Contestant 2', field: 'user2.username' },
        { headerName: 'Result', field: 'result' },
        {
            sortable: false,
            filter: false,
            headerName: '',
            cellRenderer: param => {
                const stageCurrent = param.data.stage.isCurrent;
                const isAutoWin = param.data.result.includes('autowin');
                const round = param.data;
                if (!roundsFormAdmin.doesWinnerExist && stageCurrent && !isAutoWin) {
                    return (
                        <SetResult
                            fetchRoundsForm={fetchRoundsForm}
                            round={round}
                            setLoading={setLoading}
                        />
                    );
                }
                return null; // Hide the cell if conditions are not met
            },
        },
    ];

    return (
        <Box
            mt='5%'
            width='100%'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            height='90%'
        >
            {!loading &&
                <>
                    <Typography variant={headerVariant} sx={{ mb: '1.5%' }}>
                        Rounds
                    </Typography>
                    <div
                        className='ag-theme-quartz'
                        style={{
                            width: isNormalSize ? '70%' : '85%',
                            height: '65%',
                            marginBottom: '1.5%'
                        }}
                    >
                        <AgGridReact
                            rowData={roundsFormAdmin.allRounds}
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
                    {roundsFormAdmin.currentStageFinished &&
                        <Box
                            display='flex'
                            width={isNormalSize ? '70%' : '85%'}
                            justifyContent='left'
                        >
                            <ConfirmResults
                                setLoading={setLoading}
                                fetchRoundsForm={fetchRoundsForm}
                            />
                        </Box>
                    }
                </>
            }
            {loading && <CircularProgress color='secondary' />}
        </Box>
    );
}