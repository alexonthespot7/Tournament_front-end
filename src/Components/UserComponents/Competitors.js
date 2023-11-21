import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { Box, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const competitors = [
    {
        username: 'Alex',
        isOut: false,
        stage: '1/2'
    },
    {
        username: 'Anto',
        isOut: false,
        stage: '1/2'
    },
    {
        username: 'Maessy',
        isOut: false,
        stage: '1/2'
    },
    {
        username: 'Menet',
        isOut: false,
        stage: '1/2'
    },
    {
        username: 'Greedy',
        isOut: true,
        stage: '1/4'
    },
    {
        username: 'Dizzy',
        isOut: true,
        stage: '1/4'
    },

];

export default function Competitors() {

    const columnDefs = [
        { headerName: 'Username', field: 'username', sortable: true, filter: true },
        { headerName: 'Stage', field: 'stage', sortable: true, filter: true },
        {
            headerName: 'Status',
            field: 'status',
            sortable: true,
            filter: true,
            cellRenderer: (params) => (params.value ? 'Out' : 'In'),
        },
    ];

    const rowData = competitors.map((competitor, index) => ({
        id: index + 1,
        username: competitor.username,
        stage: competitor.stage,
        status: competitor.isOut,
    }));


    return (
        <Box sx={{ mt: 3 }} width='70%' display='flex' flexDirection='column' justifyContent='center' height='100%'>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Competitors
            </Typography>
            <div
                className="ag-theme-alpine"
                style={{ height: '50%', width: '100%', border: '1px solid #ccc' }}
            >
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    defaultColDef={{ flex: 1, minWidth: 150 }}
                />
            </div>
        </Box >
    );
}