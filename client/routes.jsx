import React from 'react'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'
import { mount } from 'react-mounter'

import App from '../imports/ui/App'
import AppRoute from '../imports/ui/AppRoute'
import ScannerComp from '../imports/ui/ScannerComp'
import LoginForm from '../imports/ui/LoginForm'

FlowRouter.route("/", {
	name: 'index',
	action () {
	    mount( AppRoute, {
	      content: <App />
	    })
	    console.log("route>?");
	}
})

FlowRouter.route("/room", {
	name: 'room2',
	action () {
	    mount( AppRoute, {
	      content: <ScannerComp />
	    })
	    console.log("route>?");
	}
})

FlowRouter.route("/login", {
	name: 'login',
	action () {
	    mount( AppRoute, {
	      content: <LoginForm />
	    })
	}
})