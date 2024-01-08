import React, { useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export const ScannerComp = () => {
	const [camData, setCamData] = useState(0);

	return (
		<>
		<BarcodeScannerComponent
		  width={500}
		  height={200}
		  onUpdate={(err, result) => {
		    if (result) {
		      //call visits.insert function
		      // if successful make border of image green
		      setCamData(result.text);
		      // spotVisitor(result.text);
		    }
		    else {setCamData("Not Found")};
		  }}
		/>
		<h3>{camData}</h3>
		</>
		
	)
}

export default ScannerComp
