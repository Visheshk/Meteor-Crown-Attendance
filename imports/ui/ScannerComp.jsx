import React, { useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";

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

	return (
		<div className='split-screen'>
        <div className='scanner-column'>
        <BarcodeScannerComponent
          onUpdate={(err, result) => {
            if (result) {
              setCamData(result.text);
              checkBarcode(result.text);
            }
            else {setCamData("Not Found")};
          }}
        />
        </div>
        <div className="barcode-column">
          <h3>{JSON.stringify(codeVisitor)} </h3>
          
        </div>
      </div>
	)
}

export default ScannerComp
