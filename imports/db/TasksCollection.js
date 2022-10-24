import { Mongo } from 'meteor/mongo';

export const TasksCollection = new Mongo.Collection('tasks');
export const VisitorsCollection = new Mongo.Collection('visitors');
export const VisitsCollection = new Mongo.Collection('visits');
