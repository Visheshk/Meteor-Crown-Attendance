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

      <form className="set-name login-form" onSubmit={setName}>
        <div> <label htmlFor="password">Set your name (just once is enough) </label>
          <input type="text" name="name" placeholder="Name" required /> 
        </div>
        <div>
          <button type="submit"> Set Name </button>
        </div>
      </form>
      
      <form className="update-data login-form" onSubmit={handleSubmit}>  
      <div> <label htmlFor="password">New Feature</label>
        <input type="text" name="fieldName" placeholder="Feature" required /> 
      </div>
      <div> <label htmlFor="password">Feature Value</label>
        <input type="text" name="fieldValue" placeholder="Value" required /> 
      </div>
      <div>
        <button type="submit">Add Data</button>
      </div>

      </form>
      

    </>
  );
};
