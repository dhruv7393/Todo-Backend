const mongoose = require('mongoose');
 
const DailyTaskSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type:String,
        required: [true, 'Please add a text value']
    },
    done:{
        type:Boolean,
        required: [true, 'Please add wether its done or not']
    },
    edited:{
        type:String,
        required: [true, 'Please add the date of edit']
    },
    pending:{
        type:Number,
        required: [true, 'Please add the pending count']
    }
});
 
module.exports = mongoose.model(
    'DailyTask', DailyTaskSchema, "DailyTask");