import React from 'react'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'
import { mount } from 'react-mounter'

import App from '../imports/ui/App'
import AppRoute from '../imports/ui/AppRoute'
import ScannerComp from '../imports/ui/ScannerComp'
// import AboutPage from '/imports/ui/AboutPage'


FlowRouter.route('/', {
  name: 'index',
  action() {
    // Render a template using Blaze
    this.render('templateName');

    // Can be used with BlazeLayout,
    // and ReactLayout for React-based apps
  }
});


FlowRouter.route("/room", {
	name: 'room',
	action () {
	    mount( AppRoute, {
	      content: <ScannerComp />
	    })

	}
})