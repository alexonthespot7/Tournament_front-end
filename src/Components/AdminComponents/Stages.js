import { Box, Typography } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import FlagIcon from '@mui/icons-material/Flag';

const stages = [
    {
        "stageid": 1,
        "stage": "No",
        "isCurrent": false
    },
    {
        "stageid": 2,
        "stage": "1/4",
        "isCurrent": true
    },
    {
        "stageid": 3,
        "stage": "1/2",
        "isCurrent": false
    },
    {
        "stageid": 4,
        "stage": "final",
        "isCurrent": false
    }
];

export default function Stages() {
    const columnDefs = [
        { headerName: 'Stage', field: 'stage' },
        { cellRenderer: params => { return params.value ? <FlagIcon /> : <></> }, headerName: 'Current', field: 'isCurrent' },
    ];
    return (
        <Box sx={{ mt: 10 }} width='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center' height='90%' >
            <Typography variant="h4" sx={{ mb: 2 }}>
                Stages
            </Typography>
            <div className="ag-theme-material" style={{ width: '50%', height: '65%', marginBottom: '1.5%' }}>
                <AgGridReact
                    rowData={stages}
                    columnDefs={columnDefs}
                    defaultColDef={{ flex: 1, resizable: true, filter: true, sortable: true, cellStyle: { 'textAlign': 'left' } }}
                    pagination={true}
                    paginationPageSize={7}
                    animateRows={true}
                />
            </div>
        </Box>
    );
}