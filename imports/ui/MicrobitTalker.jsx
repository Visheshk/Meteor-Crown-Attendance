import { Meteor } from 'meteor/meteor';
import React, { useState, useRef } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import microbit from 'microbit-web-bluetooth'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

// import {YardMath} from './YardMath';

export const MicrobitTalker = ({act}) => {
	const [bitDevice, setBitDevice] = useState({});
	const [mbData, setMbData] = useState([]);
	const [dataField, setDataField] = useState('');
	const [pageField, setPageField] = useState('');
	const [logging, setLogging] = React.useState(false);

	const stateRef = useRef();
	stateRef.current=pageField;
	// console.log(act);

	let activity = "40 yard dash";
	if (act) {
		activity = act;	
	}

	const uartMessage = function (event) {
		console.log(JSON.stringify(event.detail, null, 2));
		setDataField(event.detail);
		if (event.detail == "40ydstart") {
			setPageField("40start");
			activity = "40 yard dash";
		}
		else if (event.detail == "40ydstop") {
			setPageField("40stop");
			activity = "40 yard dash";
		}
		else if (event.detail == "5start") {
			setPageField("5start");
			// activity = "5105 sprint";
		}
		else if (event.detail == "5post1") {
			setPageField("5post1");
			// activity = "5105 sprint";
		}
		else if (event.detail == "5post2") {
			setPageField("5post2");
			// activity = "5105 sprint";
		}
		postData();
	}

	const buttonPress = function (event) {
		// console.log(JSON.stringify(event, null, 2));
		// console.log(dataField, pageField);
		// console.log(stateRef);

		if (event.detail == 0) {
			console.log("a press");
			if (event.type == "buttonastatechanged") {
				setDataField("a press");
			}
			else if (event.type == "buttonbstatechanged") {
				setDataField("b press");
			}
			postData()
		}
		else {
			console.log(event)
		}
		// console.log(event);
		// console.log(button);
	}

		const pageFieldChange = event => {
        setPageField(event.target.value);
        // console.log(pageField);
    };

    const handleValueChange = event => {
        setDataField(event.target.value);
    };

    const postData = event => {
    	console.log(dataField, pageField);
    	
    	let dd = new Date();
    	if (stateRef.current != "") {
    		console.log(activity);
	    	let newLog = {
					"epochTime": dd.getTime(),
					"timestamp": dd.toISOString(),
					"microbitMessage": dataField,
					"pageField": stateRef.current,
					"activity": activity ///***TODO: make this dyanimc/inherited from yard math
				}
				Meteor.call('device.addLog', newLog);
			}
			else {
				console.log("no property");
			}
    };

	async function connectBit() {
		const device = await microbit.requestMicrobit(window.navigator.bluetooth);
		// console.log(device);
		await setBitDevice(device);
		// console.log(device);
		if (device) {
			const services = await microbit.getServices(device);
      if (services.deviceInformationService) {
          // console.log(await services.deviceInformationService.readDeviceInformation());
      }
      if (services.uartService) {
          services.uartService.addEventListener("receiveText", uartMessage);
          await services.uartService.send(new Uint8Array([104, 101, 108, 108, 111, 58])); // hello:
      }

      if (services.buttonService) {
      	services.buttonService.addEventListener("buttonastatechanged", buttonPress, "a");
        services.buttonService.addEventListener("buttonbstatechanged", buttonPress, "b");
      }

		}

		// add to list here
		// 

	}

	return (
		<Grid container item direction="column" spacing={10} md={8} justifyContent="space-around">
			<Grid container item direction="row" spacing={1} alignItems="center"  justifyContent="space-between">
					<Grid item md={1}>
					</Grid>
					<Grid item md={2}>
						<Button variant="outlined" onClick={connectBit}> Connect </Button>
					</Grid>
					
					<Grid item  md={4}>
						<TextField 
							id="microbitDataField" 
							label="Property" 
							variant="filled" 
							// value= {pageField}
				      onChange= {pageFieldChange}
						/>
					</Grid>
					<Grid item md={4}>
						<TextField 
							id="manualDataValue" 
							label="Value" 
							variant="filled" 
							value= {dataField}
				      onChange= {handleValueChange}
						/>

					</Grid>
					<Grid item md={1}>
							
						<Button variant="outlined" onClick={postData}> Post Data</Button>
					</Grid>
					<Grid item md={1}>
						<FormControlLabel control={<Switch checked={logging} onChange={toggleLogging} />} label="Label" />
					</Grid>

	    </Grid>
	    <Grid container item direction="row" spacing={4} alignItems="center">
	    <Grid item md={1}>
					</Grid>
			    {/*<YardMath />*/}
		   </Grid>
	   </Grid>
	)
}

export default MicrobitTalker
