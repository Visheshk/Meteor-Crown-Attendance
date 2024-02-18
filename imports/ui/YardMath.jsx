import { Meteor } from 'meteor/meteor';
import React, { useState, useRef, Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import BarcodeScannerComponent from "react-qr-barcode-scanner";
import microbit from 'microbit-web-bluetooth'
import TextField from '@mui/material/TextField';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { DeviceCollection } from '/imports/db/TasksCollection';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

import { ScannerComp } from './ScannerComp';
import { VisitorLogs } from './VisitorLogs';



/*

step 1: add scanner component
step 2: if user Id is established: enable claim button

claim logic - tag corresponding dev logs as "claimed"
	
add to scoreboard, score


//make duplicable page 5-10-10-5

*/


export const YardMath = () => {

	const [speedRows, setSpeedRows] = useState([]);
	const [userId, setUserId] = useState('');
	const [userInfo, setUserInfo] = useState({});

	const stateRef = useRef();
	stateRef.user = userInfo;

	const columns = [
		{ field: 'start', headerName: 'Start', type: 'text', width: 150 },
		{ field: 'stop', headerName: 'Stop',  width: 150 },
		{ field: 'speed', headerName: 'Speed (seconds)', width: 150 },
		{ field: 'buttons', headerName: '', width: 150,
			sortable: false,
		    renderCell: ({ row }) =>
		    	<Button size="small" variant="outlined" disabled={row.disabled} onClick={() => claimEntry(row)}>
	        		Claim
	      		</Button>,
		 },
		// { field: 'date', headerName: 'Date Created', width: 110 },
	];

	// const deleteEntry = function (row) {
	const claimEntry = function (row) {
	 	console.log(row);
	 	console.log(stateRef.current);
	 	// console.log(stateRef.current[parseInt(row["id"])])
	 }

    const setupStartStopTable = function (logs) {
    	let startVal = 0;
    	let stopVal = 0;
    	let rowNumber = 0;
    	let starts = logs.filter(x => {return x.pageField=="start"});
    	let stops = logs.filter(x => {return x.pageField=="stop"});
    	let rows = [];
    	let lastStartIndex = -1;
    	let startRow = {};
    	for (let r in logs) {
    		if (logs[r].pageField == "start") {
    			lastStartIndex = r;
    			startRow = {
    				start: logs[r]["timestamp"].slice(11,23),
    				stop: "",
    				speed: "",
    				id: "soloStart:" + logs[r]["_id"],
    				disabled: true
    			}
    		}
    		else if (logs[r].pageField == "stop") {
    			if (lastStartIndex > -1) {
    				tr = {
    					start: logs[lastStartIndex]["timestamp"].slice(11,23),
    					stop: logs[r]["timestamp"].slice(11,23),
    					speed: (logs[r]["epochTime"] - logs[lastStartIndex]["epochTime"]) / 1000,
    					id: "start:" + logs[lastStartIndex]["_id"] + "::stop:" + logs[r]["_id"],
    				};
    				// console.log(tr);
    				rows.push(tr);
    				startRow = {};
    				lastStartIndex = -1;
    			}
    		}
    	}
    	if (Object.keys(startRow).length > 0) {
    		rows.push(startRow);
    	}

    	// for (s in starts) {
    	// 	// console.log(starts)
    	// 	let stopTime = [""];
    	// 	let gap = 10000;
    	// 	if (stops.length > s) {
    	// 		stopTime = [stops[s]["epochTime"], stops[s]["timestamp"]];
    	// 		gap = stopTime[0] - starts[s]["epochTime"];
    	// 	}
    	// 	rows.push({
    	// 		start: starts[s]["timestamp"].slice(11,23),
    	// 		stop: stopTime[0],
    	// 		speed: gap,
    	// 		id: s
    	// 	})
    	// }
    	// setSpeedRows(rows);
    	// con
    	return rows;
    }


    const { devLogs, rows } = useTracker(() => {
    	const handler = Meteor.subscribe('devicelogs');	
    	const devLogs = DeviceCollection.find({$and: [
    		{claimed: {$ne: true} },
    		{cleared: {$ne: true} },
    		// {}
		]}).fetch();
    	// console.log(devLogs);
    	const rows = setupStartStopTable(devLogs);
    	// console.log(rows);
    	// stateRef.rows = rows;
    	return { devLogs, rows };
    });
    stateRef.current = devLogs;


    




    // if (!handler.ready()) {
    //   return { ...noDataAvailable, isLoading: true };
    // }

    

	return (
		// <Grid container spacing={4} alignItems="center"  justifyContent="space-between">
	<Box>
		{ rows ? (
			<Box>	
				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={5}
					// loading={isLoading}
					rowHeight={40}
				  />
			</Box>
		  ): 
		<> </>}
		<Box>
			<Button variant="contained"> Clear </Button>
		</Box>
		<Box>
			<ScannerComp />
		</Box>
    </Box>

	)
}

export default YardMath
