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
import YardMath from '../imports/ui/YardMath'
import FiveTen from '../imports/ui/FiveTen'

import Dash from '../imports/ui/Dash'
import Agility from '../imports/ui/Agility'
import Count from '../imports/ui/Count'

FlowRouter.route("/", {
	name: 'index',
	action () {
	    mount( AppRoute, {
	      content: <App />
	    })
	    // console.log("route>?");
	}
})

FlowRouter.route("/room", {
	name: 'room2',
	action () {
	    mount( AppRoute, {
	      content: <Room />
	    })
	    // console.log("route>?");
	}
})

FlowRouter.route("/microbit", {
	name: 'micro',
	action () {
	    mount( AppRoute, {
	      content: <YardMath />
	    })
	    // console.log("route>?");
	}
})

FlowRouter.route("/dash", {
	name: 'dash',
	action () {
	    mount( AppRoute, {
	      content: <Dash />
	    })
	    // console.log("route>?");
	}
})

FlowRouter.route("/agility", {
	name: 'agility',
	action () {
	    mount( AppRoute, {
	      content: <Agility />
	    })
	    // console.log("route>?");
	}
})


FlowRouter.route("/count", {
	name: 'count',
	action () {
	    mount( AppRoute, {
	      content: <Count />
	    })
	    // console.log("route>?");
	}
})




FlowRouter.route("/40yard", {
	name: '40yard',
	action () {
	    mount( AppRoute, {
	      content: <YardMath />
	    })
	    // console.log("route>?");
	}
})

FlowRouter.route("/5105", {
	name: '5sprint',
	action () {
	    mount( AppRoute, {
	      content: <FiveTen />
	    })
	    // console.log("route>?");
	}
})

FlowRouter.route("/lanesprint", {
	name: 'lanesprint',
	action () {
	    mount( AppRoute, {
	      content: <FiveTen />
	    })
	    // console.log("route>?");
	}
})

FlowRouter.route("/dribblesprint", {
	name: 'dribblesprint',
	action () {
	    mount( AppRoute, {
	      content: <FiveTen />
	    })
	    // console.log("route>?");
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