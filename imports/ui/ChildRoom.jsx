

import React, { useState, useMemo } from "react";
import { ScannerComp } from "./ScannerComp";
import { VisitorLogs } from "./VisitorLogs";
import { Button, Grid, TextField, Typography, Snackbar } from "@mui/material";
import { useTracker } from "meteor/react-meteor-data";
import { ScoreCollection } from "/imports/db/TasksCollection";

export const ChildRoom = ({ spotUser, eventSetter, parentActivity }) => {
  const [eventId, setEventId] = useState("");
  const [activityScore, setActivityScore] = useState("");
  const [userId, setUserId] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [toastOpen, setToastOpen] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [renderReq, setRenderReq] = useState(false);

  const handler = Meteor.subscribe("scorelogs");
  const scores = ScoreCollection.find({}).fetch();

  const postLog = () => {
    let errText = "";
    if (eventId === "") errText += " no event id! \n";
    if (activityScore === "") errText += " no score! \n";
    if (userId === "") errText += " no user! \n";
    if (parentActivity === "") errText += " no activity name name! \n";

    if (errText !== "") {
      setErrorText(errText);
      setToastOpen(true);
    } else {
      const log = {
        activity: parentActivity,
        eventId,
        score: activityScore,
        userBarcode: userId,
        userInfo,
      };
      Meteor.call("score.addLog", log);
      setRenderReq((prev) => prev + 1);
    }
  };

  const childUserIdUpdate = ({ code, data }) => {
    setUserId(code);
    setUserInfo(data);
    if (spotUser) spotUser({ data });
  };

  const lockEvent = () => {
    Session.set("eventId", eventId);
    Session.set("activity", parentActivity);
    eventSetter(eventId);
    setRenderReq((prev) => prev + 1);
  };

  const userScores = useMemo(
    () =>
      scores.filter(
        (x) => x.eventId === eventId && x.activity === parentActivity
      ),
    [scores, eventId, parentActivity]
  );

  const pageFeatures = useMemo(
    () => !!(parentActivity && eventId),
    [parentActivity, eventId]
  );


  return (
  <Grid container direction="column" spacing={2} style={{ paddingTop: '20px' }}>
    <Grid item xs={12} container justifyContent="center" alignItems="center">
      <Typography 
        variant="h3" 
        component="h1" 
        fontWeight="bold" 
        style={{ 
          marginBottom: '20px',
          textAlign: 'center',
          color: '#212121', // This is Material-UI's primary blue color. Adjust as needed.
          textTransform: 'uppercase',
          paddingLeft: '10px'

        }}
      >
        {parentActivity}
      </Typography>
    </Grid>

    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12} md={8} lg={6}>
        <ScannerComp spotUser={childUserIdUpdate} />
      </Grid>
    </Grid>

    <Grid
      container
      justifyContent="center"
      alignItems="center"
      spacing={1}
      style={{ paddingTop: "20px" }}
    >
      <Grid item>
        <TextField
          id="eventID"
          label="Event ID"
          variant="outlined"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          style={{ width: "200px" }}
        />
      </Grid>
      <Grid item>
        <Button
          id="saveDeets"
          onClick={lockEvent}
          variant="contained"
          style={{ width: "100px", height: "56px" }}
        >
          Save
        </Button>
      </Grid>
      <Grid item>
        <TextField
          id="activityScore"
          label="Activity Score"
          variant="outlined"
          value={activityScore}
          onChange={(e) => setActivityScore(e.target.value)}
          style={{ width: "200px" }}
        />
      </Grid>
      <Grid item>
        <Button
          id="logData"
          onClick={postLog}
          variant="contained"
          style={{ width: "100px", height: "56px" }}
        >
          Log
        </Button>
      </Grid>
    </Grid>

    <Grid container item justifyContent="center">
      <Grid item xs={12} md={6}>
        <VisitorLogs scores={userScores} updateReq={renderReq} />
      </Grid>
      <Grid item xs={12} md={1} sx={{ display: "none" }}>
        {renderReq}
      </Grid>
    </Grid>

    <Snackbar
      open={toastOpen}
      autoHideDuration={2000}
      onClose={() => setToastOpen(false)}
      message={errorText}
    />
  </Grid>
);


};

export default ChildRoom;




