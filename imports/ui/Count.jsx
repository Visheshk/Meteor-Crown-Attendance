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

export const Count = () => {

	const activityName = "Count";
	const [speedRows, setSpeedRows] = useState([]);
	const [userInfo, setUserInfo] = useState({});
	const [eventId, setEventId] = useState("");
	const stateRef = useRef();

	stateRef.current= [0, 0, 0];
	stateRef.current[1] = userInfo;
	stateRef.current[2] = eventId;

	const childUserIdUpdate = ({data}) => {
		setUserInfo(data);
	}

	const columns = [
		{ field: 'start', headerName: 'Start', type: 'text', width: 300 },
		{ field: 'end', headerName: 'End',  width: 300 },
		{ field: 'count', headerName: 'Count', width: 300 },
		// { field: 'stops', headerName: 'Posts',  width: 150 },
		// { field: 'stop 2', headerName: '10 yards',  width: 150 },
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
	 	let thisid = row.id
	 	startId = thisid.slice((thisid.indexOf("start:") + 6), thisid.indexOf("::"));
	 	stopId = thisid.slice((thisid.indexOf("stop:") + 5), );
	 	//// TODO: add error checker and  toast notification

	 	dd = new Date();
		log = { 
			"activity": activityName, 
			"eventId": stateRef.current[2],
			"score": row.count, 
			"crossIds": row.crossIds,
			"logInfo": {row},
			"epochTime": dd.getTime(), 
			"userBarcode": userInfo.barcodeId,
			"userInfo": userInfo,
			"timestamp": dd.toISOString()
		 };
		console.log(userInfo);
		Meteor.call('score.addLog', log);
		console.log(startId, stopId)
		Meteor.call('devlogs.claim', row.crossIds, userInfo)
	 	// console.log(stateRef.current[parseInt(row["id"])])
	 }

	 const clearLogs = function () {
	 	Meteor.call('devlogs.clearByTime', ["countcross"]);
	 }

	 const infoTester = function () {
	 	console.log(eventId);
	 }

    const setupStartStopTable = function (logs) {
    	let startVal = 0;
    	let stopVal = 0;
    	let rowNumber = 0;
    	// let starts = logs.filter(x => {return x.pageField=="5start"});
    	// let posts = logs.filter(x => {return (x.pageField).indexOf("countcross") != -1});
    	// console.log(posts)
    	// let stops = logs.filter(x => {return x.pageField=="5stop"});
    	let rows = [];
    	let lastStartIndex = -1;
    	let count = 0;
    	let startRow = {};
    	for (let r in logs) {
    		if (logs[r].pageField == "countcross") {
    			if (lastStartIndex == -1) {
	    			lastStartIndex = r;
	    			startRow = {
	    				start: logs[r]["timestamp"].slice(11,23),
	    				end: "",
	    				count: 0,
	    				crossIds: [logs[r]["_id"]],
	    				id: "soloStart:" + logs[r]["_id"],
	    				epochTime: logs[r]["epochTime"],
	    				disabled: true
	    			}
	    		}
	    		else {
	    			if ((logs[r]["epochTime"] - startRow["epochTime"]) < 60000){
	    				count += 1;
	    				startRow["count"] = count
	    				startRow.crossIds.push(logs[r]["_id"]);
	    				startRow.end = logs[r]["timestamp"].slice(11,23);
	    			}
	    			else {
	    				tr = {
	    					start: startRow.start,
		    				end: startRow.end,
		    				count: count,
		    				crossIds: startRow.crossIds,
		    				id: "soloEnd:" + logs[r]["_id"],
		    				epochTime: logs[r]["epochTime"],
		    				disabled: Object.keys(stateRef.current[1]).length == 0 || stateRef.current[2] == ""
	    				}
	    				lastStartIndex = -1;
	    				count = 0;
	    				rows.push(tr);
	    				// startRow = {};
	    				startRow = {
		    				start: logs[r]["timestamp"].slice(11,23),
		    				end: "",
		    				count: 0,
		    				crossIds: [logs[r]["_id"]],
		    				id: "soloStart:" + logs[r]["_id"],
		    				epochTime: logs[r]["epochTime"],
		    				disabled: true
		    			}
	    			}
	    		}
    		}
			// console.log(startRow);
			console.log(stateRef);
			
			// startRow = {};
			// lastStartIndex = -1;
    	}
    	if (Object.keys(startRow).length > 0) {
    		rows.push(startRow);
    	}
    	return rows;
    }


    const { devLogs, rows } = useTracker(() => {
    	const handler = Meteor.subscribe('devicelogs');	
    	const devLogs = DeviceCollection.find({$and: [
	    	{activity: activityName},
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
	<Box>
		<MicrobitTalker act={activityName}/>
		{ rows ? (
			<Box>	
				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={5}
					// loading={isLoading}
					rowHeight={100}
					sx={{ fontSize: 30, m: 2, p:2, 
						'& .MuiDataGrid-cell': {
				          p: 3,
				        },
				        '& .MuiDataGrid-columnHeaderTitle': {
				          p: 3,
				        }
				     }}
				  />
			</Box>
		  ): 
		<> </>}
		<Box>
			<Button variant="contained" onClick={clearLogs} > Clear </Button>
			<Button variant="outline" onClick={infoTester} > Tester </Button>
		</Box>
		<Box>
			<ChildRoom spotUser = {childUserIdUpdate} eventSetter = {setEventId}  parentActivity={activityName}/>
		</Box>
    </Box>

	)
}

export default Count