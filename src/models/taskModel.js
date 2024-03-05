const mongoose = require('mongoose');
 
const TasksSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type:String,
        required: [true, 'Please add a text value']
    },
    notes:{
        type:Array,
        required: [false, 'Please add a text value']
    },
    imp: {
        type:Number,
        required: [true, 'Please check if imp is not added']
    },
    done:{
        type:Boolean,
        required: [true, 'Please add wether its done or not']
    },
    pinned:{
        type:Boolean,
        required: [true, 'Please add wether its done or not']
    }
});
 
module.exports = mongoose.model(
    'Tasks', TasksSchema, "Tasks");