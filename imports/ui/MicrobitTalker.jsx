import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import microbit from 'microbit-web-bluetooth'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {YardMath} from './YardMath';

export const MicrobitTalker = () => {
	const [bitDevice, setBitDevice] = useState({});
	const [mbData, setMbData] = useState([]);
	const [dataField, setDataField] = useState('');
	const [pageField, setPageField] = useState('');

	const uartMessage = function (event) {
		console.log(JSON.stringify(event.detail, null, 2));
		let dd = new Date();
		if (microbitMessage == "3") {
			let newLog = {
				"epochTime": dd.getTime(),
				"timestamp": dd.toISOString(),
				"microbitMessage": event.detail,
				"pageField": pageField
			}
			mbData.push(newLog);
			Meteor.call('device.addLog', newLog);
			console.log(mbData);
		}
	}

		const handleTextInputChange = event => {
        setPageField(event.target.value);
    };

    const handleValueChange = event => {
        setDataField(event.target.value);
    };

    const postData = event => {
    	console.log(dataField, pageField);
    	let dd = new Date();
    	let newLog = {
				"epochTime": dd.getTime(),
				"timestamp": dd.toISOString(),
				"microbitMessage": event.detail,
				"pageField": pageField
			}

			Meteor.call('device.addLog', newLog);
    };


	async function connectBit() {
		const device = await microbit.requestMicrobit(window.navigator.bluetooth);
		console.log(device);
		await setBitDevice(device);
		console.log(device);
		if (device) {
			const services = await microbit.getServices(device);
      if (services.deviceInformationService) {
          console.log(await services.deviceInformationService.readDeviceInformation());
      }
      if (services.uartService) {
          services.uartService.addEventListener("receiveText", uartMessage);
          await services.uartService.send(new Uint8Array([104, 101, 108, 108, 111, 58])); // hello:
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
							label="Microbit Data Field" 
							variant="filled" 
							// value= {textInput}
				      onChange= {handleTextInputChange}
						/>
						</Grid>
						<Grid item md={4}>
							<TextField 
								id="manualDataValue" 
								label="Manual Data Value" 
								variant="filled" 
								// value= {textInput}
					      onChange= {handleValueChange}
							/>

						</Grid>
						<Grid item md={1}>
							
							<Button variant="outlined" onClick={postData}> Post Data</Button>
						</Grid>
						<Grid item >
						</Grid>

	    </Grid>
	    <Grid container item direction="row" spacing={4} alignItems="center">
	    <Grid item md={1}>
					</Grid>
			    <YardMath />
		   </Grid>
	   </Grid>
	)
}

export default MicrobitTalker
