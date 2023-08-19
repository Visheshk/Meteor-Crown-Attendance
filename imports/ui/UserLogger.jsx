import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Session } from 'meteor/session'

export const UserLogger = () => {
  const [text, setText] = useState('');

  const handleSubmitOld = e => {
    e.preventDefault();
    console.log(e.target.age.value);
    // Meteor.call('visitors.insert', e.target.name.value, e.target.age.value, e.target.gender.value, e.target.dob.value)
    Meteor.call('visitors.insert', e.target.name.value, e.target.age.value, e.target.gender.value, e.target.dob.value)
  };

  const handleSubmit = e => {
    e.preventDefault();
    fn = e.target.fieldName.value;
    fv = e.target.fieldValue.value;
    console.log(Session.get("name"))
    Meteor.call('visitors.nameUpdate', Session.get("name"), fn, fv)
    // Session.set("user");
  }

  const setName = e => {
    e.preventDefault();
    console.log(e.target.name.value);
    name = e.target.name.value;
    Session.set("name", name);
    Meteor.call
  }


  return (
    <>
    <div>
      <form className="set-name" onSubmit={setName}>
        <input type="text" name="name" placeholder="name" required /> 
        <button type="submit"> Set Name </button>
      </form>
      
      <form className="update-data" onSubmit={handleSubmit}>  
        <input type="text" name="fieldName" placeholder="feature" required /> 
        <input type="text" name="fieldValue" placeholder="value" required /> 
        <button type="submit">Add Data</button>
      </form>
      </div>

    </>
  );
};
