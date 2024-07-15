import { Meteor } from 'meteor/meteor';
import { TextField, Button, Container, Stack, FormControl, Grid, Item, Box } from '@mui/material';
import React, { useState } from 'react';

export const TaskForm = () => {
  const [text, setText] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // console.log(e.target.age.value);
    // Meteor.call('visitors.insert', e.target.name.value, e.target.age.value, e.target.gender.value);
    Meteor.call('visitors.insert', e.target.name.value);

  };

  const massAdd = e => {
    e.preventDefault();
    var nu = parseInt(e.target.number.value); var pre = e.target.prefix.value;
    // console.log(, );
    // Meteor.call('visitors.insert', e.target.name.value, e.target.age.value, e.target.gender.value);
    for (var x = 1; x <= nu; x++) {
      Meteor.call('visitors.insert', pre + String(x))
    }
    // Meteor.call('visitors.insert', e.target.name.value);

  };

  const editUser = e => {
    e.preventDefault();
    console.log(e.target.qrcode.value, e.target.name.value);
    // Meteor.call('visitors.insert', e.target.name.value, e.target.age.value, e.target.gender.value, e.target.dob.value)
    Meteor.call('visitors.qrNameUpdate', e.target.qrcode.value, e.target.name.value);
  };

  const editUserFeature = e => {
    e.preventDefault();
    // console.log(e.target.qrcode.value, e.target.name.value);
    // Meteor.call('visitors.insert', e.target.name.value, e.target.age.value, e.target.gender.value, e.target.dob.value)
    Meteor.call('visitors.qrFeatureUpdate', e.target.qrcode.value, e.target.feature.value, e.target.featureVal.value);
  };

  return (
    <>
    {/*<Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          <Button variant="outlined" color="secondary" type="submit">Add Visitor</Button>
        </Grid>
        <Grid item xs={6}>
          <Item>xs=4</Item>
        </Grid>
      </Grid>
    </Box>*/}

    <form className="task-form" onSubmit={handleSubmit} style ={{ float: "left", padding: 5}}>
      <p className='form-field-title'>Name: <input type="text" name="name" placeholder="name" required /> </p>
      {/*<p className='form-field-title'>Age: <input type="number" name="age" placeholder="age"  /></p>
      <p className='form-field-title'>Gender: <input type="text" name="gender" placeholder="gender"  /></p>*/}
      {/*<p className='form-field-title'>Date of Birth: <input type="date" name="dob"  /></p>*/}
      <button type="submit">Add Visitor</button>
    </form>

    <form className="task-form" onSubmit={massAdd} style ={{ float: "left", padding: 5}}>
      <p className='form-field-title'>Number: <input type="number" name="number" placeholder="1" required /> </p>
      <p className='form-field-title'>Name Prefix: <input type="text" name="prefix" placeholder="prefix" required /> </p>
      {/*<p className='form-field-title'>Age: <input type="number" name="age" placeholder="age"  /></p>
      <p className='form-field-title'>Gender: <input type="text" name="gender" placeholder="gender"  /></p>*/}
      {/*<p className='form-field-title'>Date of Birth: <input type="date" name="dob"  /></p>*/}
      <button type="submit">Mass Add Visitors</button>
    </form>

    <form className="task-form" onSubmit={editUser}>
      <p className='form-field-title'>qr code: <input type="number" name="qrcode" required /> </p>
      <p className='form-field-title'>New name: <input type="text" name="name" placeholder="new name"  /></p>
      
      <button type="submit">Edit Visitor Name</button>
    </form>
    <form className="task-form" onSubmit={editUserFeature}>
      <p className='form-field-title'>qr code: <input type="number" name="qrcode" required /> </p>
      <p className='form-field-title'>New feature: <input type="text" name="feature" placeholder="feature"  /></p>
      <p className='form-field-title'>feature value: <input type="text" name="featureVal" placeholder="featureVal"  /></p>
      
      <button type="submit">Edit Visitor</button>
    </form>
    </>
    
  );
};
