import React from 'react'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'
import { mount } from 'react-mounter'

import App from '../imports/ui/App'
import AppRoute from '../imports/ui/AppRoute'
import Room from '../imports/ui/Room'
// import ScannerComp from '../imports/ui/ScannerComp'
import LoginForm from '../imports/ui/LoginForm'
import ScoreBoard from '../imports/ui/ScoreBoard'
import MicrobitTalker from '../imports/ui/MicrobitTalker'

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
	      content: <Room />
	    })
	    console.log("route>?");
	}
})

FlowRouter.route("/microbit", {
	name: 'micro',
	action () {
	    mount( AppRoute, {
	      content: <MicrobitTalker />
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

FlowRouter.route("/scoreboard", {
	name: 'scoreboard',
	action () {
	    mount( AppRoute, {
	      content: <ScoreBoard />
	    })
	}
})