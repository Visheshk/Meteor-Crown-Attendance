import React from 'react';
// import * as ReactDOM from "react-dom";

import { Meteor } from 'meteor/meteor';
// import { render } from 'react-dom';
import { App } from '/imports/ui/App';
// import { AppRoute } from '/imports/ui/AppRoute';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'
import './routes';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

Meteor.startup(() => {
  // render(<AppRoute />, document.getElementById('react-target'));
  
  // ReactDOM.createRoot(document.getElementById("react-target")).render(
  //   <React.StrictMode>
  //     <RouterProvider router={router} />
  //   </React.StrictMode>
  // );

  Accounts.ui.config({
    requestPermissions: {
    },
    requestOfflineToken: {
      google: true
    },
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'

  });
});
