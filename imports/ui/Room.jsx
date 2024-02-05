import React, { useState, useMemo} from 'react';
import { ScannerComp } from './ScannerComp';
import { VisitorLogs } from './VisitorLogs';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import { useTracker } from 'meteor/react-meteor-data';

import { ScoreCollection } from '/imports/db/TasksCollection';

export const Room = () => {
	const [pageActivity, setPageActivity] = useState('');
	const [eventId, setEventId] = useState('');
	const [activityScore, setActivityScore] = useState('');
	const [userId, setUserId] = useState('');
	const [toastOpen, setToastOpen] = useState(false);
	const [errorText, setErrorText] = useState('');
	// const [userScores, setUserScores] = useState([]);
	const [scoreDisplay, setScoreDisplay] = useState(false);
	//step 1: get log code to work

		//
	//add a table inside scanner comp that also retrieves event specific logs

	// const { scores } = useTracker(() => {
  	const handler = Meteor.subscribe('scorelogs');	
  	const scores = ScoreCollection.find({}).fetch();
  // 	console.log(scores);
  // 	return { scores };
  // });

	const postLog = function () {
		// console.log(featureVal);
		// console.log(userId);
		let errText = '';
		if (eventId == '') {
			errText += ' no event id! \n';
		}
		if (activityScore == '') {
			errText += ' no score! \n';
		}
		if (userId == '') {
			errText += ' no user! \n';
		}
		if (pageActivity == '') {
			errText += ' no activity name name! \n';
		}
		if (errText != '') {
			setErrorText(errText);
			setToastOpen(true);
		}
		else {
			dd = new Date();
			log = { 
				"activity": pageActivity, 
				"eventId": eventId,
				"score": activityScore, 
				"epochTime": dd.getTime(), 
				"userBarcode": userId,
				"timestamp": dd.toISOString()
			 };
			Meteor.call('score.addLog', log)
		}
	}

	const childUserIdUpdate = (data) => {
		setUserId(data);
	}
	const handleClose = (event) => {
    setToastOpen(false);
  };


	const errorNotify = function () {
		
	}
	const userScores = useMemo(() => {
			return scores.filter(x => {return  x.eventId == eventId && x.userBarcode == userId});		
		}, [userId, eventId, scores])
	// if (userId != '' && pageActivity != '' && eventId != '') {
		
		// if (uss.length > 0){
		// 	// setScoreDisplay(true);
		// 	console.log(uss);
		// 	// setUserScores(uss);
			
		// }
	// }

	return (
		<Grid container item direction="column" spacing={2} justifyContent="space-around" >
			<Grid container item direction="row">
				<Grid container item md={4}>
					<TextField id="activityField" label="Activity" variant="standard" onChange={event => setPageActivity(event.target.value)} />
				</Grid>
					<Grid container item md={3}>
						<TextField id="eventID" label="Event ID" variant="standard" onChange={event => setEventId(event.target.value)}/>
					</Grid>
					{/*<Grid container item md={2}>
						<Button id="saveDeets" size="small">Save</Button>
					</Grid>*/}
			</Grid>
			<Grid container item md={8}>
				<ScannerComp spotUser = {childUserIdUpdate}/>
			</Grid>
			<Grid container item md={4}>
			
				<VisitorLogs scores={userScores}/>
			
			</Grid>
			<Grid container item  direction="row">
				<Grid container item md={3}>
					<TextField id="activityScore" label="Activity Score" variant="standard" onChange={event => setActivityScore(event.target.value)}/>
				</Grid>
				<Grid container item md={2}>
					<Button id="logData" onClick={postLog} variant="outlined">Log</Button>
				</Grid>
			</Grid>

			<Snackbar
			  open={toastOpen}
			  autoHideDuration={2000}
			  onClose={handleClose}
			  message={errorText}
			/>
		</Grid>

	)
}

export default Room
