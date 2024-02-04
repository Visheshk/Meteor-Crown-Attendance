import { Mongo } from 'meteor/mongo';

export const TasksCollection = new Mongo.Collection('tasks');
export const VisitsCollection = new Mongo.Collection('visits');


export const VisitorsCollection = new Mongo.Collection('visitors');
export const DeviceCollection = new Mongo.Collection('devicelogs');
export const ScoreCollection = new Mongo.Collection('scorelogs');
