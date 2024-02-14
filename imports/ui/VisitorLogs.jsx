import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';

const columns = [
	{ field: 'activity', headerName: 'activity', type: 'number', width: 150 },
	{ field: 'athlete', headerName: 'athlete',  width: 150 },
	{ field: 'score', headerName: 'score',  width: 150 },


	// { field: 'speed', headerName: 'Speed', type: 'number', width: 150 },
	// { field: 'date', headerName: 'Date Created', width: 110 },
];
let rows = [];

export const VisitorLogs = ({visitorId, updateReq, eventId, activity, scores}) => {
	// const [codeVisitor, setCodeVisitor] = useState({});
	// const thisScores = scores.filter(x => {return  x.eventId == eventId && x.userBarcode == visitorId});
	rows = scores.map((score, index) => ({"activity": score.activity, "athlete": score.userInfo.name, "score": score.score, "id": index}));
	// console.log(updateReq);

	return (
		<>
		<DataGrid
			pagination
			rows={rows}
			columns={columns}
			pageSize={5}
			initialState={ {
		    pagination: { paginationModel: { pageSize: 5 } }
			} }
			pageSizeOptions = {[5,10]}

			// loading={isLoading}
			// rowHeight={180}
	  />
	  <Grid container item md={1} sx={{display: "none"}}>
		{updateReq}
		</Grid>
	  </>
	)
}

export default VisitorLogs
