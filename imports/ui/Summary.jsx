

import React, { useState, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { ScoreCollection } from '/imports/db/TasksCollection';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { ScannerComp } from './ScannerComp';

const Summary = () => {
  const [userInfo, setUserInfo] = useState({});
  const [eventId, setEventId] = useState("");
  const stateRef = useRef();

  stateRef.current = [0, 0, 0];
  stateRef.current[1] = userInfo;
  stateRef.current[2] = eventId;

  const childUserIdUpdate = ({ data }) => {
    setUserInfo(data);
  }

  const columns = [
    { 
      field: 'score', 
      headerName: 'Score', 
      flex: 1, 
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
    },
    { 
      field: 'timestamp', 
      headerName: 'Timestamp', 
      flex: 1, 
      minWidth: 150,
      headerAlign: 'center',
      align: 'center',
    },
  ];

  const setupSummaryTable = (logs) => {
    return logs.map(log => ({
      id: log._id,
      activity: log.activity,
      score: log.score,
      timestamp: new Date(log.timestamp).toLocaleString(),
    }));
  }

  const { scoreLogs } = useTracker(() => {
    const handler = Meteor.subscribe('scorelogs');
    const scoreLogs = ScoreCollection.find({ 'userInfo.barcodeId': userInfo.barcodeId }).fetch();
    return { scoreLogs };
  });

  const rows = setupSummaryTable(scoreLogs);

  // Group rows by activity
  const groupedRows = rows.reduce((acc, row) => {
    if (!acc[row.activity]) {
      acc[row.activity] = [];
    }
    acc[row.activity].push(row);
    return acc;
  }, {});

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f0f0f0' }}>
      <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" textAlign="center" mb={4}>
        Player Summary
      </Typography>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={8} lg={6}>
          <ScannerComp spotUser={childUserIdUpdate} />
        </Grid>
      </Grid>
      {Object.keys(groupedRows).length > 0 ? (
        <Grid container spacing={3} justifyContent="center" alignItems="flex-start" mt={4}>
          {Object.keys(groupedRows).map((activity, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" color="primary">
                  {activity}
                </Typography>
                {groupedRows[activity].length > 0 ? (
                  <DataGrid
                    rows={groupedRows[activity]}
                    columns={columns}
                    autoHeight
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                    sx={{
                      '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                      },
                      '& .MuiDataGrid-cell': {
                        fontSize: '1.1rem',
                      },
                      '& .MuiDataGrid-cell:focus': {
                        outline: 'none',
                      },
                      '& .MuiDataGrid-row:nth-of-type(even)': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  />
                ) : (
                  <Typography variant="body1">No data available for {activity}.</Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" component="h3" gutterBottom>
            No logged data for this user
          </Typography>
          <Typography variant="body1">
            Please scan a valid user barcode to view their summary.
          </Typography>
        </Paper>
      )}
    </Box>
  )
}

export default Summary;