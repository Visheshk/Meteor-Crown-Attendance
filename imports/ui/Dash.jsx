import { Meteor } from 'meteor/meteor';
import React, { useState, useRef, Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import microbit from 'microbit-web-bluetooth'
import TextField from '@mui/material/TextField';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { DeviceCollection } from '/imports/db/TasksCollection';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

import { ChildRoom } from './ChildRoom';
import { ScannerComp } from './ScannerComp';
import { VisitorLogs } from './VisitorLogs';
import { MicrobitTalker } from './MicrobitTalker';

import ScoreboardClock from './dashscoreboard'
export const Dash = () => {

	const [speedRows, setSpeedRows] = useState([]);
	const [userInfo, setUserInfo] = useState({});
	const [eventId, setEventId] = useState("");
	const stateRef = useRef();

	stateRef.current= [0, 0, 0];
	stateRef.current[1] = userInfo;
	stateRef.current[2] = eventId;

	const childUserIdUpdate = ({data}) => {
		setUserInfo(data);
		// console.log(data);
		// console.log(userInfo);
		// console.log(stateRef);
		// console.log(userId, userInfo);
	}

	const columns = [
		{ field: 'start', headerName: 'Start',  minWidth: 300 },
		{ field: 'stop', headerName: 'Stop',   minWidth: 300 },
		{ field: 'speed', headerName: 'Speed (seconds)',  minWidth: 300 },
		{ field: 'buttons', headerName: '', minWidth:150,
			sortable: false,
		    renderCell: ({ row }) =>
		    	<Button size="small" variant="outlined" disabled={row.disabled} onClick={() => claimEntry(row)}>
	        		Claim
	      		</Button>,
		 },
		// { field: 'date', headerName: 'Date Created', width: 110 },
	];

	// const columns = [
	// 	{ field: 'start', headerName: 'Start', minWidth: 100 },
	// 	{ field: 'stop', headerName: 'Stop',  minWidth: 100 },
	// 	{ field: 'speed', headerName: 'Speed (seconds)',  minWidth: 100 },
	// ];
	

	// const deleteEntry = function (row) {
	const claimEntry = function (row) {
	 	console.log(row);
	 	console.log(stateRef.current);
	 	let thisid = row.id
	 	startId = thisid.slice((thisid.indexOf("start:") + 6), thisid.indexOf("::"));
	 	stopId = thisid.slice((thisid.indexOf("stop:") + 5), );
	 	//// TODO: add error checker and  toast notification

	 	dd = new Date();
		log = { 
			"activity": "Dash", 
			"eventId": stateRef.current[2],
			"score": row.speed, 
			"logInfo": {row},
			"epochTime": dd.getTime(), 
			"userBarcode": userInfo.barcodeId,
			"userInfo": userInfo,
			"timestamp": dd.toISOString()
		 };
		console.log(userInfo);
		Meteor.call('score.addLog', log);
		console.log(startId, stopId)
		Meteor.call('devlogs.claim', [startId, stopId], userInfo)
	 	// console.log(stateRef.current[parseInt(row["id"])])
	 }

	 const clearLogs = function () {
	 	Meteor.call('devlogs.clearByTime', ["dashstart", "dashstop"]);
	 }

	 const infoTester = function () {
	 	console.log(eventId);
	 }

    const setupStartStopTable = function (logs) {
    	let startVal = 0;
    	let stopVal = 0;
    	let rowNumber = 0;
    	
    	let rows = [];
    	let lastStartIndex = -1;
    	let startRow = {};
    	console.log(logs);
    	for (let r in logs) {
    		if (logs[r].pageField == "dashstart") {
    			lastStartIndex = r;
    			startRow = {
    				start: logs[r]["timestamp"].slice(11,23),
    				stop: "",
    				speed: "",
    				id: "soloStart:" + logs[r]["_id"],
    				disabled: true
    			}
    		}
    		else if (logs[r].pageField == "dashstop") {
    			if (lastStartIndex > -1) {
    				tr = {
    					start: logs[lastStartIndex]["timestamp"].slice(11,23),
    					stop: logs[r]["timestamp"].slice(11,23),
    					speed: (logs[r]["epochTime"] - logs[lastStartIndex]["epochTime"]) / 1000,
    					id: "start:" + logs[lastStartIndex]["_id"] + "::stop:" + logs[r]["_id"],
    					disabled: (Object.keys(stateRef.current[1]).length == 0 || stateRef.current[2] == "")
    				};
    				console.log(tr);
    				console.log(stateRef);
    				rows.push(tr);
    				startRow = {};
    				lastStartIndex = -1;
    			}
    		}
    	}
    	if (Object.keys(startRow).length > 0) {
    		rows.push(startRow);
    	}
    	return rows;
    }


    const { devLogs, rows } = useTracker(() => {
    	const handler = Meteor.subscribe('devicelogs');	
    	const devLogs = DeviceCollection.find({$and: [
	    	{activity: "Dash"},
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
    stateRef.current[0] = devLogs;


    // if (!handler.ready()) {
    //   return { ...noDataAvailable, isLoading: true };
    // }

    

	return (
		// <Grid container spacing={4} alignItems="center"  justifyContent="space-between">
	<Box sx={{ p: 2, m:2 }}>
		<MicrobitTalker act="Dash" />
		{ rows ? (

			<Box>	
				<ScoreboardClock rows={rows} columns={columns} />

			</Box>
		  ): 
		<> </>}
		<Box display="flex" justifyContent="center" alignItems="center">
    		<Button variant="contained" onClick={clearLogs}>Clear</Button>
   			<Button variant="outlined" onClick={infoTester}>Tester</Button>
		</Box>

		<Box>
			<ChildRoom spotUser = {childUserIdUpdate} eventSetter = {setEventId}  parentActivity="Dash"/>
		</Box>
    </Box>
	

	)
}

export default Dash