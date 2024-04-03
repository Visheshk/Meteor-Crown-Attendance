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

/*


claim logic - tag corresponding dev logs as "claimed"
	
add to scoreboard, score


//make duplicable page 5-10-10-5


//add scoreboard

*/


export const PassCount = () => {

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
		{ field: 'start', headerName: 'Start', type: 'text', width: 150 },
		{ field: 'end', headerName: 'End',  width: 150 },
		{ field: 'speed', headerName: 'Speed (seconds)', width: 150 },
		{ field: 'stops', headerName: 'Posts',  width: 150 },
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
			"activity": "sprints", 
			"eventId": stateRef.current[2],
			"score": row.speed, 
			"stopsTimes": row.stops,
			"stopRows": row.stopIds, 
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
	 	Meteor.call('devlogs.clearByTime', ["5start", "5post1", "5post2"]);
	 }

	 const infoTester = function () {
	 	console.log(eventId);
	 }

    const setupStartStopTable = function (logs) {
    	let startVal = 0;
    	let stopVal = 0;
    	let rowNumber = 0;
    	// let starts = logs.filter(x => {return x.pageField=="5start"});
    	let posts = logs.filter(x => {return (x.pageField).indexOf("5post") != -1});
    	console.log(posts)
    	// let stops = logs.filter(x => {return x.pageField=="5stop"});
    	let rows = [];
    	let lastStartIndex = -1;
    	let startRow = {};
    	for (let r in logs) {
    		if (logs[r].pageField == "5start") {
    			if (lastStartIndex == -1) {
	    			lastStartIndex = r;
	    			startRow = {
	    				start: logs[r]["timestamp"].slice(11,23),
	    				end: "",
	    				stops: "",
	    				stopIds: [],
	    				speed: "",
	    				id: "soloStart:" + logs[r]["_id"],
	    				disabled: true
	    			}
	    		}
	    		else {
	    			tr = {
    					start: logs[lastStartIndex]["timestamp"].slice(11,23),
    					end: logs[r]["timestamp"].slice(11,23),
    					speed: (logs[r]["epochTime"] - logs[lastStartIndex]["epochTime"]) / 1000,
    					stops: startRow.stops,
    					stopIds: startRow.stopIds,
    					id: "start:" + logs[lastStartIndex]["_id"] + "::stop:" + logs[r]["_id"],
    					disabled: (Object.keys(stateRef.current[1]).length == 0 || stateRef.current[2] == "")
    				};
    				// console.log(tr);
    				// console.log(stateRef);
    				rows.push(tr);
    				startRow = {};
    				lastStartIndex = -1;
	    		}
    		}
    		else if ((logs[r].pageField).indexOf("5post") != -1) {
    			{
    				if (lastStartIndex != -1) {
    					console.log("adding post");
    					thisTime = Math.round((logs[r]["epochTime"] - logs[lastStartIndex]["epochTime"]) / 1000);
    					startRow.stops += (logs[r].pageField).charAt(5) + ": " + String(thisTime) + " ";
    					startRow.stopIds.push(logs[r]["_id"]);
    				}
    			}
    		}
    		else if (logs[r].pageField == "5stop") {
    			if (lastStartIndex > -1) {
    				tr = {
    					start: logs[lastStartIndex]["timestamp"].slice(11,23),
    					end: logs[r]["timestamp"].slice(11,23),
    					speed: (logs[r]["epochTime"] - logs[lastStartIndex]["epochTime"]) / 1000,
    					stops: startRow.stops,
    					stopIds: startRow.stopIds,
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
	    	{activity: "sprints"},
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
		<MicrobitTalker act="sprints"/>
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
			<Button variant="contained" onClick={clearLogs} > Clear </Button>
			<Button variant="outline" onClick={infoTester} > Tester </Button>
		</Box>
		<Box>
			<ChildRoom spotUser = {childUserIdUpdate} eventSetter = {setEventId}  parentActivity="sprints"/>
		</Box>
    </Box>

	)
}

export default PassCount