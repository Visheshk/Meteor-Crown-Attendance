import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

export const TaskForm = () => {
  const [text, setText] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    console.log(e.target.age.value);
    Meteor.call('visitors.insert', e.target.name.value, e.target.age.value, e.target.gender.value, e.target.dob.value)
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <p className='form-field-title'>Name: <input type="text" name="name" placeholder="name" required /> </p>
      <p className='form-field-title'>Age: <input type="number" name="age" placeholder="age" required /></p>
      <p className='form-field-title'>Gender: <input type="text" name="gender" placeholder="gender" required /></p>
      <p className='form-field-title'>Date of Birth: <input type="date" name="dob" required /></p>
      <button type="submit">Add Visitor</button>
    </form>

    
  );
};
