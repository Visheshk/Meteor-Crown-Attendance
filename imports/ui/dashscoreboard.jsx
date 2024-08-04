import React from 'react';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  '& .MuiDataGrid-cell': {
    backgroundColor: theme.palette.background.paper,
    fontSize: '3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  '& .MuiDataGrid-root': {
    margin: '0 auto', // Center the DataGrid horizontally
  },
}));

const ScoreboardClock = ({ rows, columns }) => {
  return (
    <StyledDataGrid
      rows={rows}
      columns={columns}
      disableColumnMenu
      disableSelectionOnClick
      hideFooterSelectedRowCount
      autoHeight
      columnBuffer={2} // Add some buffer space between columns
    />
  );
};

export default ScoreboardClock;