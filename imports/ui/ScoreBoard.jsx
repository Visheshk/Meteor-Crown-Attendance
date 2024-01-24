import React, { useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export const ScoreBoard = () => {
	const [camData, setCamData] = useState(0);

	return (
		<>
		<BarcodeScannerComponent
		  width={500}
		  height={200}
		  onUpdate={(err, result) => {
		    if (result) {
		      setCamData(result.text);
		    }
		    else {setCamData("Not Found")};
		  }}
		/>
		<h3>{camData}</h3>
		</>
	)
}

export default ScoreBoard
