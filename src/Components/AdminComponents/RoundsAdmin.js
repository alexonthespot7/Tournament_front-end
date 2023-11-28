import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import { Box, Button, Card, IconButton, List, ListItem, ListItemText, ListSubheader, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';
import SetResult from './SetResult';


const roundsFormAdmin = {
    "allRounds": [
        {
            "roundid": 1,
            "result": "No",
            "user1": {
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
                    "stageid": 2,
                    "stage": "1/2",
                    "isCurrent": true
                }
            },
            "user2": {
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
                    "stageid": 2,
                    "stage": "1/2",
                    "isCurrent": true
                }
            },
            "stage": {
                "stageid": 2,
                "stage": "1/2",
                "isCurrent": true
            }
        },
        {
            "roundid": 2,
            "result": "loginTest autowin",
            "user1": {
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
                    "stageid": 2,
                    "stage": "1/2",
                    "isCurrent": true
                }
            },
            "user2": null,
            "stage": {
                "stageid": 2,
                "stage": "1/2",
                "isCurrent": true
            }
        },
        {
            "roundid": 3,
            "result": "No",
            "user1": null,
            "user2": null,
            "stage": {
                "stageid": 4,
                "stage": "final",
                "isCurrent": false
            }
        },
        {
            "roundid": 1,
            "result": "No",
            "user1": {
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
                    "stageid": 2,
                    "stage": "1/2",
                    "isCurrent": true
                }
            },
            "user2": {
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
                    "stageid": 2,
                    "stage": "1/2",
                    "isCurrent": true
                }
            },
            "stage": {
                "stageid": 2,
                "stage": "1/2",
                "isCurrent": true
            }
        },
        {
            "roundid": 2,
            "result": "loginTest autowin",
            "user1": {
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
                    "stageid": 2,
                    "stage": "1/2",
                    "isCurrent": true
                }
            },
            "user2": null,
            "stage": {
                "stageid": 2,
                "stage": "1/2",
                "isCurrent": true
            }
        },
        {
            "roundid": 3,
            "result": "No",
            "user1": null,
            "user2": null,
            "stage": {
                "stageid": 4,
                "stage": "final",
                "isCurrent": false
            }
        }
    ],
    "doesWinnerExist": false,
    "currentStageFinished": true
}

export const findUsernameOfContestant = (username) => {
    return username ? username : '—';
}

export default function RoundsAdmin() {

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
                        <SetResult round={round} />
                    );
                }
                return null; // Hide the cell if conditions are not met
            },
            width: 100,
        },
    ];

    return (
        <Box sx={{ mt: 10 }} width='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center' height='90%' >
            <Typography variant="h4" sx={{ mb: 2 }}>
                Rounds
            </Typography>
            <div className="ag-theme-material" style={{ width: '70%', height: '65%', marginBottom: '1.5%' }}>
                <AgGridReact
                    rowData={roundsFormAdmin.allRounds}
                    columnDefs={columnDefs}
                    defaultColDef={{ flex: 1, resizable: true, filter: true, sortable: true, cellStyle: { 'textAlign': 'left' } }}
                    pagination={true}
                    paginationPageSize={7}
                    animateRows={true}
                />
            </div>
            {roundsFormAdmin.currentStageFinished &&
                <Box display='flex' width='70%' justifyContent='left'>
                    <Button variant='contained' color='secondary'>
                        Confirm results
                    </Button>
                </Box>
            }
        </Box>
    );
}