import React, { useState } from 'react';


export const VisitorLogs = ({visitorId, eventId, activity, scores}) => {
	// const [codeVisitor, setCodeVisitor] = useState({});
	// const thisScores = scores.filter(x => {return  x.eventId == eventId && x.userBarcode == visitorId});

	return (
		<>
			{scores.map(score => (
				"activity: " + score.activity + "\n score: " + score.score
			))}
		</>
	)
}

export default VisitorLogs
