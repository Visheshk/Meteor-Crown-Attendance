import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'));
  Accounts.ui.config({
    requestPermissions: {
      facebook: ['user_likes'],
      github: ['user', 'repo']
    },
    requestOfflineToken: {
      google: true
    },
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'

  });
});
