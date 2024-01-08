import React from 'react'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'
import { mount } from 'react-mounter'

import App from '../imports/ui/App'
import AppRoute from '../imports/ui/AppRoute'
import ScannerComp from '../imports/ui/ScannerComp'

FlowRouter.route("/", {
	name: 'index',
	action () {
	    mount( App, {
	      content: <ScannerComp />
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