import React, { useState, useMemo} from 'react';
import { ScannerComp } from './ScannerComp';
import { VisitorLogs } from './VisitorLogs';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Snackbar from '@mui/material/Snackbar';
import { useTracker } from 'meteor/react-meteor-data';

import { ScoreCollection } from '/imports/db/TasksCollection';

export const Room = () => {
	const [pageActivity, setPageActivity] = useState(Session.get("activity"));
	const [eventId, setEventId] = useState(Session.get("eventId"));
	const [activityScore, setActivityScore] = useState('');
	const [userId, setUserId] = useState('');
	const [toastOpen, setToastOpen] = useState(false);
	const [errorText, setErrorText] = useState('');
	// const [pageFeatures, setPageFeatures] = useState(false);
	// const [userScores, setUserScores] = useState([]);
	const [renderReq, setRenderReq ] = useState(false);
	const [scoreDisplay, setScoreDisplay] = useState(false);
	//step 1: get log code to work
	let pageFeatures = "";
	let pageTitle = "none";

	// console.log(Session.get('activity'), Session.get('eventId'))
	if (Session.get('activity') && Session.get('eventId') && Session.get('activity') != '' && Session.get('eventId') != '' ) {
		// console.log(Session.get('activity'), Session.get('eventId'))
		// setPageActivity(Session.get('pageActivity'));
		// setEventId(Session.get('eventId'));
		// setPageFeatures(true);
		pageFeatures = "none";
		pageTitle = "";
		//
	}
	else {
		pageFeatures = "";
		pageTitle = "none";
	}
	// console.log(pageFeatures);	
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
			let uid = userId
			setRenderReq(renderReq + 1);
			console.log(renderReq);
			// setUserId(userId +" ");
			// setUserId(uid);
		}
	}

	

	const childUserIdUpdate = (data) => {
		setUserId(data);
	}
	const handleClose = (event) => {
    setToastOpen(false);
  };

  const lockEvent = (event) => {
  	Session.set('eventId', eventId);
  	Session.set('activity', pageActivity);
  	setRenderReq(renderReq + 1);
  	// setEventId(eventId + "");
  	// setPageFeatures(true);
  	pageFeatures = "none";
  	// pageFeatures = "none";
		pageTitle = "";
  }


	const errorNotify = function () {
		
	}
	const userScores = useMemo( () => {	
			uss = scores.filter(x => {return  x.eventId == eventId && x.activity == pageActivity});
			console.log(scores, uss, eventId);
			// setRenderReq(renderReq + 1);
			return  uss;
		}, [pageActivity, eventId, scores] )

	const pageFeatures2 = useMemo(() => {
			if (pageActivity && eventId) {
				return true;
			}
			else {
				return false;
			}
			// return scores.filter(x => {return  x.eventId == eventId && x.userBarcode == userId});		
		}, [pageActivity, eventId])
	// if (userId != '' && pageActivity != '' && eventId != '') {
		
		// if (uss.length > 0){
		// 	// setScoreDisplay(true);
		// 	console.log(uss);
		// 	// setUserScores(uss);
			
		// }
	// }

	return (
		<Grid container item direction="column" spacing={2}  >
				<Grid container item direction="row" sx={{display: pageFeatures}}>				
					<Grid container item md={4} >
						<TextField id="	" label="Activity" variant="standard" onChange={event => setPageActivity(event.target.value)} />
					</Grid>
					<Grid container item md={3}>
						<TextField id="eventID" label="Event ID" variant="standard" onChange={event => setEventId(event.target.value)}/>
					</Grid>
					<Grid container item md={2}>
						<Button id="saveDeets" size="small" onClick={lockEvent}>Save</Button>
					</Grid>
				</Grid>

				<Grid container item direction="row" sx={{display: pageTitle}}>				
					<Grid container item md={8} zeroMinWidth>
						<Typography variant="h3" component="h3">
							  {pageActivity}
						</Typography>
					</Grid>
					<Grid container item md={3}>
						<Typography variant="h5" component="h5">
							  {eventId}
						</Typography>
					</Grid>
					{/*<Grid container item md={2}>
						<Button id="changeDeets" size="small" onClick={unlockEvent}>Change</Button>
					</Grid>*/}
				</Grid>
			<Grid container item md={8}>
				<ScannerComp spotUser = {childUserIdUpdate}/>
			</Grid>
			
			<Grid container item  direction="row">
				<Grid container item md={3}>
					<TextField id="activityScore" label="Activity Score" variant="standard" onChange={event => setActivityScore(event.target.value)}/>
				</Grid>
				<Grid container item md={2}>
					<Button id="logData" onClick={postLog} variant="outlined">Log</Button>
				</Grid>
			</Grid>

			<Grid container item >
				<Grid container item md={6}>
					<VisitorLogs scores={userScores}/>
						{/*{userScores.map(score => (
							"activity: " + score.activity + "\n score: " + score.score
						))}*/}
				</Grid>
				<Grid container item md={1} sx={{display: "none"}}>
				{renderReq}
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
