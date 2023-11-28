import { Box, Button, IconButton, Typography } from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { AgGridReact } from 'ag-grid-react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditUserAdmin from './EditUserAdmin';
import AddUser from './AddUser';

const usersPageForm = {
    "users": [
        {
            "id": 2,
            "username": "danrey",
            "passwordHash": "$2a$12$0Mu/91y.kvDE7rj0ZXrWkOxUISfqEuQcXyU.luDJIe7DW2W/eqUYq",
            "role": "USER",
            "isOut": false,
            "isCompetitor": true,
            "email": "bgw2595@myy.haaga-helia.fi",
            "verificationCode": null,
            "accountVerified": true,
            "stage": {
                "stageid": 1,
                "stage": "No",
                "isCurrent": true
            }
        },
        {
            "id": 3,
            "username": "wanyeser",
            "passwordHash": "$2a$12$0Mu/91y.kvDE7rj0ZXrWkOxUISfqEuQcXyU.luDJIe7DW2W/eqUYq",
            "role": "USER",
            "isOut": false,
            "isCompetitor": true,
            "email": "mrbudach2@mail.ru",
            "verificationCode": null,
            "accountVerified": true,
            "stage": {
                "stageid": 1,
                "stage": "No",
                "isCurrent": true
            }
        },
        {
            "id": 4,
            "username": "loginTest",
            "passwordHash": "$2a$12$19lxeD0nHwNrMxnGhWFNoOLMC/xOxd81ug1D.fboYQeoRHjyR9hym",
            "role": "USER",
            "isOut": false,
            "isCompetitor": true,
            "email": "login.test@gmail.com",
            "verificationCode": null,
            "accountVerified": true,
            "stage": {
                "stageid": 1,
                "stage": "No",
                "isCurrent": true
            }
        },
        {
            "id": 5,
            "username": "danrey2",
            "passwordHash": "$2a$12$0Mu/91y.kvDE7rj0ZXrWkOxUISfqEuQcXyU.luDJIe7DW2W/eqUYq",
            "role": "USER",
            "isOut": false,
            "isCompetitor": true,
            "email": "bgw259d5@myy.haaga-helia.fi",
            "verificationCode": null,
            "accountVerified": true,
            "stage": {
                "stageid": 1,
                "stage": "No",
                "isCurrent": true
            }
        },
        {
            "id": 6,
            "username": "wanyeser2",
            "passwordHash": "$2a$12$0Mu/91y.kvDE7rj0ZXrWkOxUISfqEuQcXyU.luDJIe7DW2W/eqUYq",
            "role": "USER",
            "isOut": false,
            "isCompetitor": true,
            "email": "mdrbudach2@mail.ru",
            "verificationCode": null,
            "accountVerified": true,
            "stage": {
                "stageid": 1,
                "stage": "No",
                "isCurrent": true
            }
        },
        {
            "id": 7,
            "username": "danrey32",
            "passwordHash": "$2a$12$0Mu/91y.kvDE7rj0ZXrWkOxUISfqEuQcXyU.luDJIe7DW2W/eqUYq",
            "role": "USER",
            "isOut": false,
            "isCompetitor": true,
            "email": "bg1w259d5@myy.haaga-helia.fi",
            "verificationCode": null,
            "accountVerified": true,
            "stage": {
                "stageid": 1,
                "stage": "No",
                "isCurrent": true
            }
        },
        {
            "id": 8,
            "username": "wanyes3er2",
            "passwordHash": "$2a$12$0Mu/91y.kvDE7rj0ZXrWkOxUISfqEuQcXyU.luDJIe7DW2W/eqUYq",
            "role": "USER",
            "isOut": false,
            "isCompetitor": true,
            "email": "mdrbu3dach2@mail.ru",
            "verificationCode": null,
            "accountVerified": true,
            "stage": {
                "stageid": 1,
                "stage": "No",
                "isCurrent": true
            }
        },
        {
            "id": 1,
            "username": "axosinc",
            "passwordHash": "$2a$12$0Mu/91y.kvDE7rj0ZXrWkOxUISfqEuQcXyU.luDJIe7DW2W/eqUYq",
            "role": "ADMIN",
            "isOut": true,
            "isCompetitor": false,
            "email": "aleksei2.shevelenkov@gmail.com",
            "verificationCode": null,
            "accountVerified": true,
            "stage": {
                "stageid": 1,
                "stage": "No",
                "isCurrent": true
            }
        }
    ],
    "showMakeBracket": true,
    "showMakeAllCompetitors": false,
    "showReset": false,
    "bracketMade": false
}

export default function Users() {

    const columnDefs = [
        { headerName: 'Username', field: 'username' },
        { headerName: 'Email', field: 'email' },
        { headerName: 'Status', field: 'isOut', cellRenderer: params => { return <Typography>{params.value ? 'Out' : 'In'}</Typography> } },
        { headerName: 'Participant?', field: 'isCompetitor', cellRenderer: params => { return <Typography>{params.value.toString()}</Typography> } },
        { headerName: 'Stage', field: 'stage.stage' },
        { headerName: 'Role', field: 'role' },
        { headerName: 'Verified', field: 'accountVerified', cellRenderer: params => { return <Typography>{params.value.toString()}</Typography> } },
        {
            sortable: false,
            filter: false,
            headerName: '',
            cellRenderer: params => {
                const user = params.data;
                return (
                    <EditUserAdmin user={user} bracketMade={usersPageForm.bracketMade} />
                );
            },
            flex: 1,
        },
        {
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
                        <IconButton>
                            <DeleteIcon color='error' />
                        </IconButton>
                    );
                }
                return null; // Hide the cell if conditions are not met
            },
            flex: 1,
        },
    ];

    const makeAllCompetitors = () => { }
    const makeBracket = () => { }
    const reset = () => { }

    return (
        <Box sx={{ mt: 10 }} width='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center' height='90%' >
            <Typography variant="h4" sx={{ mb: 2 }}>
                Users
            </Typography>
            <div className="ag-theme-material" style={{ width: '70%', height: '65%', marginBottom: '1.5%' }}>
                <AgGridReact
                    rowData={usersPageForm.users}
                    columnDefs={columnDefs}
                    defaultColDef={{ flex: 2, resizable: true, filter: true, sortable: true, cellStyle: { 'textAlign': 'left' }, cellRenderer: params => { return <Typography>{params.value}</Typography> } }}
                    pagination={true}
                    paginationPageSize={10}
                    animateRows={true}
                />
            </div>
            <Box display='flex' width='70%' justifyContent='space-around'>
                <Button color='secondary' variant='contained'>
                    Stages
                </Button>
                <AddUser bracketMade={usersPageForm.bracketMade} />
                {usersPageForm.showMakeAllCompetitors && <Button variant='outlined' color='secondary' onClick={makeAllCompetitors}>
                    Make all competitors
                </Button>}
                {usersPageForm.showMakeBracket && <Button variant='contained' color='secondary' onClick={makeBracket}>
                    Make bracket
                </Button>}
                {usersPageForm.showReset && <Button variant='contained' color='error' onClick={reset}>
                    Reset
                </Button>}
            </Box>
        </Box>
    );
}