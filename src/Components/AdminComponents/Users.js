import { useContext, useEffect, useState } from 'react';

import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';

import EditUserAdmin from './EditUserAdmin';
import AddUser from './AddUser';
import MakeBracket from './MakeBracket';
import Reset from './Reset';
import MakeAllCompetitors from './MakeAllCompetitors';
import DeleteUser from './DeleteUser';

export default function Users() {
    const [loading, setLoading] = useState(true);
    const [usersPageForm, setUsersPageForm] = useState(null);

    const { windowSize, makeErrorAlert, makeWarningAlert, headerVariant, isNormalSize, size, deleteCookies } = useContext(ContextWrapper);

    useEffect(() => {
        if (Cookies.get('role') === 'ADMIN') {
            fetchUsersPageForm();
        } else {
            //redirect to main page
            makeWarningAlert('You don\'t have permission to access this page');
        }
    }, []);

    const fetchUsersPageForm = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/users`, {
                method: 'GET',
                headers: { 'Authorization': Cookies.get('jwt') }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    deleteCookies();
                    makeErrorAlert('Your session has expired, login again please');
                } else if (response.status === 403) {
                    makeErrorAlert(await response.text());
                    //redirect to main page
                } else {
                    makeErrorAlert(await response.text());
                }
                return null;
            }

            response.json()
                .then(data => {
                    setUsersPageForm(data);
                    setLoading(false);
                })
                .catch(err => makeErrorAlert(err.message));
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }

    const textSize = isNormalSize ? 16 : 13;
    const buttonSx = { fontSize: isNormalSize ? 14 : 11 }

    const columnDefs = [
        { headerName: 'Username', field: 'username' },
        { headerName: 'Email', field: 'email' },
        { width: 100, headerName: 'Status', field: 'isOut', cellRenderer: params => { return <Typography fontSize={textSize}>{params.value ? 'Out' : 'In'}</Typography> } },
        { width: 130, headerName: 'Participant?', field: 'isCompetitor', cellRenderer: params => { return <Typography fontSize={textSize}>{params.value.toString()}</Typography> } },
        { width: 100, headerName: 'Stage', field: 'stage.stage' },
        { width: 100, headerName: 'Role', field: 'role', cellRenderer: params => { return <Typography fontSize={textSize}>{params.value.toLowerCase()}</Typography> } },
        { width: 100, headerName: 'Verified', field: 'accountVerified', cellRenderer: params => { return <Typography fontSize={textSize}>{params.value.toString()}</Typography> } },
        {
            width: 80,
            sortable: false,
            filter: false,
            headerName: '',
            cellRenderer: params => {
                const user = params.data;
                return (
                    <EditUserAdmin
                        fetchUsersPageForm={fetchUsersPageForm}
                        user={user}
                        bracketMade={usersPageForm.bracketMade}
                    />
                );
            },
        },
        {
            width: 80,
            field: 'id',
            sortable: false,
            filter: false,
            headerName: '',
            cellRenderer: params => {
                const userId = params.value;
                const isParticipant = params.data.isCompetitor;
                const isAdmin = params.data.role === 'ADMIN';
                if (!(isParticipant && usersPageForm.bracketMade || isAdmin)) {
                    return (
                        <DeleteUser
                            userId={userId}
                            setLoading={setLoading}
                            fetchUsersPageForm={fetchUsersPageForm}
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
                    <Typography
                        variant={headerVariant}
                        sx={{ mb: '2%' }}
                    >
                        Users
                    </Typography>
                    <div
                        className={
                            'grid-wrapper ' +
                            "ag-theme-quartz"
                        }
                        style={{
                            width: isNormalSize ? '70%' : '90%',
                            height: '65%',
                            marginBottom: '1.5%'
                        }}
                    >
                        <AgGridReact
                            rowData={usersPageForm.users}
                            columnDefs={columnDefs}
                            defaultColDef={{ resizable: true, filter: true, sortable: true, cellStyle: { 'textAlign': 'left' }, cellRenderer: params => { return <Typography fontSize={textSize}>{params.value}</Typography> } }}
                        />
                    </div>
                    <Box
                        display='flex'
                        flexDirection={windowSize.width > 500 ? 'row' : 'column'}
                        width={isNormalSize ? '70%' : '90%'}
                        justifyContent={'space-around'}
                        gap={windowSize.width > 500 ? '' : '20%'}
                    >
                        <Box
                            flex={2}
                            display='flex'
                            justifyContent='space-around'
                        >
                            <Button
                                sx={buttonSx}
                                size={size}
                                color='secondary'
                                variant='contained'
                            >
                                Stages
                            </Button>
                            <AddUser
                                bracketMade={usersPageForm.bracketMade}
                                fetchUsersPageForm={fetchUsersPageForm}
                            />
                        </Box>
                        <Box
                            flex={3}
                            display='flex'
                            justifyContent='space-around'
                        >
                            {usersPageForm.showMakeAllCompetitors &&
                                <MakeAllCompetitors
                                    buttonSx={buttonSx}
                                    setLoading={setLoading}
                                    fetchUsersPageForm={fetchUsersPageForm}
                                />
                            }
                            {usersPageForm.showMakeBracket &&
                                <MakeBracket
                                    buttonSx={buttonSx}
                                    setLoading={setLoading}
                                    fetchUsersPageForm={fetchUsersPageForm}
                                />
                            }
                            {usersPageForm.showReset &&
                                <Reset
                                    buttonSx={buttonSx}
                                    setLoading={setLoading}
                                    fetchUsersPageForm={fetchUsersPageForm}
                                />
                            }
                        </Box>
                    </Box>
                </>
            }
            {loading && <CircularProgress color='secondary' />}
        </Box>
    );
}