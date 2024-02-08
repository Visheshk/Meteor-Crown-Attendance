import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Button from '@mui/material/Button';

export const ScannerComp = ({spotUser}) => {
	const [camData, setCamData] = useState(0);
	const [stopStream, setStopStream] = useState(true);
	const [codeVisitor, setCodeVisitor] = useState({});
	// console.log(spotUser);

	const toggleQrReader = () => {
    // Stop the QR Reader stream (fixes issue where the browser freezes when closing the modal) and then dismiss the modal one tick later
    setStopStream(!stopStream);
    console.log(stopStream);
    // setTimeout(() => closeModal(), 0);
  }

  async function checkBarcode (barcode) {
  	console.log(barcode);
    Meteor.call('visitors.findByBarcode', barcode, function (err, res) {
      if (err) {
        console.log(err);
      }
      else {
        // console.log(res);
        // console.log("setting code visitor");
        setCodeVisitor(res);
        // if (this.props){
        	// console.log(this.props);
	        spotUser(barcode);
        // }
        return res;
      }
    });
  }

  const clearUser = function () {
		setCodeVisitor({});
		spotUser("");
	}

	return (
		<Grid container spacing={1} justifyContent="space-around">
			<Grid container item md={3}>
        <BarcodeScannerComponent
          onUpdate={(err, result) => {
            if (result) {
              setCamData(result.text);
              checkBarcode(result.text);
            }
            else {setCamData("Not Found")};
          }}
        />
      </Grid>
      <Grid container item md={3}>
        <h3>{JSON.stringify(codeVisitor)} </h3>
        
      </Grid>
      <Grid container item md={2}>
					<Button id="clearUser" onClick={clearUser} variant="outlined">Clear</Button>
				</Grid>
    </Grid>
	)
}

export default ScannerComp
