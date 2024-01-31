import React, { useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export const ScannerComp = () => {
	const [camData, setCamData] = useState(0);
	const [stopStream, setStopStream] = useState(true);
	const [codeVisitor, setCodeVisitor] = useState({});

	const toggleQrReader = () => {
	    // Stop the QR Reader stream (fixes issue where the browser freezes when closing the modal) and then dismiss the modal one tick later
	    setStopStream(!stopStream);
	    console.log(stopStream);
	    // setTimeout(() => closeModal(), 0);
	  }

	  async function checkBarcode (barcode) {
	    Meteor.call('visitors.findByBarcode', barcode, function (err, res) {
	      if (err) {
	        console.log(err);
	      }
	      else {
	        console.log(res);
	        setCodeVisitor(res);
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
          <h3>{camData} {JSON.stringify(codeVisitor)} </h3>
          
        </div>
      </div>
	)
}

export default ScannerComp
