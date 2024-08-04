import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, TextField, Grid, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

export const TaskForm = () => {
  const classes = useStyles();
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    Meteor.call(
      'visitors.insert',
      e.target.name.value,
      e.target.age.value,
      e.target.gender.value,
      // e.target.dob.value
    );
  };

  const editUser = (e) => {
    e.preventDefault();
    Meteor.call('visitors.qrNameUpdate', e.target.qrcode.value, e.target.name.value);
  };

  const editUserFeature = (e) => {
    e.preventDefault();
    Meteor.call(
      'visitors.qrFeatureUpdate',
      e.target.qrcode.value,
      e.target.feature.value,
      e.target.featureVal.value
    );
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Visitor Form
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="add-visitor-content" id="add-visitor-header">
          <Typography>Add Visitor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form className={classes.root} onSubmit={handleSubmit}>
            <TextField
              required
              id="name"
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              id="age"
              label="Age"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              id="gender"
              label="Gender"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" className={classes.button}>
              Add Visitor
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="edit-name-content" id="edit-name-header">
          <Typography>Edit Visitor Name</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form className={classes.root} onSubmit={editUser}>
            <TextField
              required
              id="qrcode"
              label="QR Code"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              id="name"
              label="New Name"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" className={classes.button}>
              Edit Visitor Name
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="edit-visitor-content" id="edit-visitor-header">
          <Typography>Edit Visitor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form className={classes.root} onSubmit={editUserFeature}>
            <TextField
              required
              id="qrcode"
              label="QR Code"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              id="feature"
              label="New Feature"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              id="featureVal"
              label="Feature Value"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" className={classes.button}>
              Edit Visitor
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};