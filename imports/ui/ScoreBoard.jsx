// import React, { useState } from 'react';
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { useTracker } from 'meteor/react-meteor-data';
// import { UsersCollection } from '/imports/api/usersCollection';
import { TasksCollection, VisitorsCollection, ScoreCollection } from '/imports/db/TasksCollection';
import { Task } from './Task';
import { DataGrid } from '@mui/x-data-grid';


export const ScoreBoard = () => {
	
	const user = useTracker(() => Meteor.user());
	const userFilter = user ? { userId: user._id } : {};
	const hideCompletedFilter = { isChecked: { $ne: true } };
	const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };
	
	const addVisit = ({visitor, room}) => {
		Meteor.call('visits.insert', visitor, room);
	}
	const makeNewBarcode = ({visitor}) => {
		Meteor.call('visitors.barUpdate', visitor);
	  }	  
	
	const { scores, isLoading } = useTracker(() => {
		const noDataAvailable = { scores: [] };
		if (!Meteor.user()) {
		  return noDataAvailable;
		}
		const handler = Meteor.subscribe('scorelogs');
	
		if (!handler.ready()) {
		  return { ...noDataAvailable, isLoading: true };
		}
		const scores = ScoreCollection.find({}).fetch();	
		return { scores};
	});

	const columns = [
		{ field: 'sport', headerName: 'Sport', width: 75 },
		{ field: 'name', headerName: 'Name/ID', type: 'number', width: 110 },
		{ field: 'score', headerName: 'Score', width: 65 },
		{ field: 'event', headerName: 'Event ID', width: 65 },
		{ field: 'timestamp', headerName: 'Timestamp', width: 190 }

	];
	
	const rows = scores.map(score => ({
		id: score._id, // id is a required field for DataGrid
		name: score.userInfo.name,
		sport: score.activity,
		score: score.score,
		event: score.eventId,
		timestamp: score.timestamp
	}));
	

	return (
		<div style={{ height: 700, width: '100%' }}>
		  <DataGrid
			rows={rows}
			columns={columns}
			pageSize={5}
			// loading={isLoading}
			rowHeight={180}
		  />
		</div>
	  );
	}

export default ScoreBoard


