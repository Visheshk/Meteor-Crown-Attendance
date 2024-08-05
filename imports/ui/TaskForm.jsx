
import { Meteor } from 'meteor/meteor';
import { TextField, Button, Container, Stack, FormControl, Grid, Box } from '@mui/material';
import React, { useState } from 'react';
import {Accordion, AccordionActions, AccordionSummary, AccordionDetails} from '@mui/material';
import {ExpandMoreIcon} from '@mui/icons-material';


export const TaskForm = () => {
  const classes = useStyles();
  const [text, setText] = useState('');
  const [visitorName, setVisitorName] = useState("");
  const [bulkNo, setBulkNo] = useState(1);
  const [bulkName, setBulkName] = useState("");
  
  const [nameQR, setNameQR] = useState(1);
  const [newName, setNewName] = useState("");
  
  const [featureQR, setFeatureQR] = useState(1);
  const [featureName, setFeatureName] = useState("");
  const [featureValue, setFeatureValue] = useState("");
  
  // const [visitorName, setVisitorName] = useState("");

  const addVisitor = () => {
    console.log(visitorName);
    Meteor.call('visitors.insert', visitorName);
  }

  const multiVisitors = () => {
    // console.log(bulkNo, bulkName);
    if (bulkNo > 0 && bulkName != "") {
      for (var x = 1; x <= bulkNo; x++) {
        Meteor.call('visitors.insert', pre + String(bulkName))
      }
    }
    else {
      console.log("nothing to add");
    }
  }

  const updateQRName = () => {
    console.log(nameQR, newName);
    if (nameQR != 0 && newName != "") {
      Meteor.call('visitors.qrNameUpdate', nameQR, newName);
    }
  }

  const updateQRFeature = () => {
    console.log(nameQR, newName);
    if (featureQR != 0 && featureName != "" && featureValue != "") {
      Meteor.call('visitors.qrFeatureUpdate', featureQR, featureName, featureValue);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(e.target.age.value);
    // Meteor.call('visitors.insert', e.target.name.value, e.target.age.value, e.target.gender.value);
    Meteor.call('visitors.insert', e.target.name.value);

  };

  const massAdd = e => {
    e.preventDefault();
    var nu = parseInt(e.target.number.value); var pre = e.target.prefix.value;
    for (var x = 1; x <= nu; x++) {
      Meteor.call('visitors.insert', pre + String(x))
    }
  };

  const editUser = (e) => {
    e.preventDefault();
    console.log(e.target.qrcode.value, e.target.name.value);
    Meteor.call('visitors.qrNameUpdate', e.target.qrcode.value, e.target.name.value);
  };

  const editUserFeature = (e) => {
    e.preventDefault();
    Meteor.call('visitors.qrFeatureUpdate', e.target.qrcode.value, e.target.feature.value, e.target.featureVal.value);
  };

  return (
    <>
    <Box>

      <Grid container spacing={2}>
        <Grid item xs={2}>
          <TextField onChange = {e => setVisitorName(e.target.value)} id="newName" label="Name" variant="outlined" size="small"/>
          <Button variant="outlined" color="secondary" onClick={addVisitor} type="submit">Add Visitor</Button>
        </Grid>


        <Grid item xs={2}>
          <TextField type="number" onChange = {e => setBulkNo(e.target.value)} id="bulk-number" label="Bulk Number" variant="outlined" size="small"/>
          <TextField onChange = {e => setBulkName(e.target.value)} id="bulk-name" label="Bulk Prefix" variant="outlined" size="small"/>
          <Button variant="outlined" color="secondary" onClick={multiVisitors} type="submit">Bulk Add</Button>
        </Grid>

        <Grid item xs={2}>
          <TextField type="number" onChange = {e => setNameQR(e.target.value)} id="name-qr" label="QR Code" variant="outlined" size="small"/>
          <TextField onChange = {e => setNewName(e.target.value)} id="new-name" label="New Name" variant="outlined" size="small"/>
          <Button variant="outlined" color="secondary" onClick={updateQRName} type="submit">Update Name</Button>
        </Grid>

        <Grid item xs={2}>
          <TextField type="number" onChange = {e => setFeatureQR(e.target.value)} id="feature-qr" label="QR Code" variant="outlined" size="small"/>
          <TextField onChange = {e => setFeatureName(e.target.value)} id="feature-name" label="Feature Name" variant="outlined" size="small"/>
          <TextField onChange = {e => setFeatureValue(e.target.value)} id="feature-value" label="Feature Value" variant="outlined" size="small"/>
          <Button variant="outlined" color="secondary" onClick={updateQRFeature} type="submit">Add Feature</Button>
        </Grid>
      
      </Grid>

    </Box>
    </>
    
  );
};