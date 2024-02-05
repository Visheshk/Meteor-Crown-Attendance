import React, { useState} from 'react';
import { ScannerComp } from './ScannerComp';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';

export const Room = () => {
	const [pageFeature, setPageFeature] = useState('');
	const [eventId, setEventId] = useState('');
	const [featureVal, setFeatureVal] = useState('');
	const [userId, setUserId] = useState('');
	const [toastOpen, setToastOpen] = useState(false);
	const [errorText, setErrorText] = useState('');
	//step 1: get log code to work

		//
	//add a table inside scanner comp that also retrieves event specific logs

	const postLog = function () {
		console.log(featureVal);
		console.log(userId);
		let errText = '';
		if (eventId == '') {
			errText += ' no event id! \n';
		}
		if (featureVal == '') {
			errText += ' no feature value! \n';
		}
		if (userId == '') {
			errText += ' no user! \n';
		}
		if (pageFeature == '') {
			errText += ' no feature name! \n';
		}
		if (errText != '') {
			setErrorText(errText);
			setToastOpen(true);
		}
		else {
			dd = new Date();
			log = { 
				"feature": pageFeature, 
				"score": featureVal, 
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

	return (
		<Grid container direction="column">
			<Grid container direction="row">
				<Grid container item md={4}>
					<TextField id="featureField" label="Feature" variant="standard" onChange={event => setPageFeature(event.target.value)} />
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
				
			</Grid>
			<Grid container item  direction="row">
				<Grid container item md={3}>
					<TextField id="featureValue" label="Feature value" variant="standard" onChange={event => setFeatureVal(event.target.value)}/>
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
