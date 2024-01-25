import React, { useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { useTracker } from 'meteor/react-meteor-data';
// import { UsersCollection } from '/imports/api/usersCollection';
import { TasksCollection, VisitorsCollection } from '/imports/db/TasksCollection';

import { Task } from './Task';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TextField
} from '@mui/material';


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
	  
	const { visitors, tasks, pendingTasksCount, isLoading } = useTracker(() => {
		const noDataAvailable = { visitors: [], tasks: [], pendingTasksCount: 0 };
		if (!Meteor.user()) {
		  return noDataAvailable;
		}
		// const handler = Meteor.subscribe('tasks');
		const handler = Meteor.subscribe('visitors');
	
		if (!handler.ready()) {
		  return { ...noDataAvailable, isLoading: true };
		}
	
		const visitors = VisitorsCollection.find({}).fetch();
		// console.log(visitors);
		const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();
	
		return { visitors, pendingTasksCount };
	});
	// const [camData, setCamData] = useState(0);
	return (
		<ul className="tasks">
		{visitors.map(visitor => (
			<Task
			key={visitor._id}
			visitor={visitor}
			onAddVisit={addVisit}
			makeNewBarcode={makeNewBarcode}
			// onCheckboxClick={toggleChecked}
			// onDeleteClick={deleteTask}
			/>
		))}
		</ul>
	)
}

export default ScoreBoard


// This is the UserTable component where we will show our users
export const UserTable = () => {
	// State for the filter text
	const [filter, setFilter] = useState('');
	// State for sorting configuration
	const [sort, setSort] = useState({ field: 'name', direction: 'asc' });
  
	// Fetching user data with reactivity
	const users = useTracker(() => {
	  // Here we subscribe to the publication named 'allUsers'
	  // You'll need to define this publication on the server-side of your Meteor app
	  Meteor.subscribe('allUsers');
	  
	  // Perform the query on the UsersCollection with the current filter and sorting
	  // We're using a regex here to filter users by name according to the filter state
	  return UsersCollection.find(
		{ name: { $regex: filter, $options: 'i' } }, // 'i' makes the search case-insensitive
		{ sort: { [sort.field]: sort.direction === 'asc' ? 1 : -1 } } // Sorting based on the sort state
	  ).fetch();
	}, [filter, sort]);
  
	// This function will be called when a sortable header is clicked
	const handleSortChange = (field) => {
	  // Determine if we need to change the direction of the sorting
	  const isAsc = sort.field === field && sort.direction === 'asc';
	  setSort({ field: field, direction: isAsc ? 'desc' : 'asc' });
	};
  
	return (
	  <TableContainer component={Paper}>
		{/* Filter input field */}
		<TextField 
		  label="Filter by Name" 
		  variant="outlined" 
		  value={filter} 
		  onChange={e => setFilter(e.target.value)}
		/>
		{/* The table itself */}
		<Table>
		  {/* Table head contains headers that may contain sorting actions */}
		  <TableHead>
			<TableRow>
			  {/* Name header with sorting */}
			  <TableCell>
				<TableSortLabel
				  active={sort.field === 'name'} // Only show the sorting arrow if sorting by name
				  direction={sort.direction} // Show the current sort direction
				  onClick={() => handleSortChange('name')} // Set the field to sort by
				>
				  Name
				</TableSortLabel>
			  </TableCell>
			  {/* More headers with TableSortLabel can be added here for other sortable fields */}
			</TableRow>
		  </TableHead>
		  {/* Table body to show the user rows */}
		  <TableBody>
			{users.map((user) => (
			  <TableRow key={user._id}>
				{/* Display the name of the user */}
				<TableCell>{user.name}</TableCell>
				{/* Other cells containing more user data can be added here */}
			  </TableRow>
			))}
		  </TableBody>
		</Table>
	  </TableContainer>
	);
  };
  
  // Default export of the UserTable component
//   export default UserTable;


  //OG CODE

