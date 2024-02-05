import { Meteor } from 'meteor/meteor';
import React, { useState, Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import microbit from 'microbit-web-bluetooth'
import TextField from '@mui/material/TextField';

import Grid from '@mui/material/Grid';
import { DeviceCollection } from '/imports/db/TasksCollection';
import { DataGrid } from '@mui/x-data-grid';


const columns = [
		{ field: 'start', headerName: 'Start', type: 'number', width: 150 },
		{ field: 'stop', headerName: 'Stop',  width: 150 },
		{ field: 'speed', headerName: 'Speed', type: 'number', width: 150 },
		{ field: 'date', headerName: 'Date Created', width: 110 },
	];
	
	  // Transform visitors data for DataGrid
	// const rows = devLogs.map(log => ({
	// 	start: visitor._id, // id is a required field for DataGrid
	// 	name: visitor.name,
	// 	age: visitor.age,
	// 	gender: visitor.gender,
	// 	qrcode: visitor.qrcode,
	// 	date: visitor.createdAt
	// }));

let rows = [];



export const YardMath = () => {

	 const [speedRows, setSpeedRows] = useState([]);

    const setupStartStopTable = function (logs) {
    	let startVal = 0;
    	let stopVal = 0;
    	let rowNumber = 0;
    	let starts = logs.filter(x => {return x.pageField=="start"});
    	let stops = logs.filter(x => {return x.pageField=="stop"});
    	let  rows = [];
    	for (s in starts) {
    		// console.log(starts)
    		let stopTime = [""];
    		let gap = 10000;
    		if (stops.length > s) {
    			stopTime = [stops[s]["epochTime"], stops[s]["timestamp"]];
    			gap = stopTime[0] - starts[s]["epochTime"];
    		}
    		rows.push({
    			start: starts[s]["epochTime"],
    			stop: stopTime[0],
    			speed: gap,
    			id: s
    		})
    	}
    	// setSpeedRows(rows);
    	// con
    	return rows;
    }


    const { devLogs, rows } = useTracker(() => {
    	const handler = Meteor.subscribe('devicelogs');	
    	const devLogs = DeviceCollection.find({}).fetch();
    	console.log(devLogs);
    	const rows = setupStartStopTable(devLogs);
    	console.log(rows);
    	return { devLogs, rows };
    });
    




    // if (!handler.ready()) {
    //   return { ...noDataAvailable, isLoading: true };
    // }

    

	return (
		// <Grid container spacing={4} alignItems="center"  justifyContent="space-between">
		<>
		{ rows ? (
			<DataGrid
				rows={rows}
				columns={columns}
				pageSize={5}
				// loading={isLoading}
				rowHeight={180}
			  />
		  ): 
		<> </>}
    </>

	)
}

export default YardMath
