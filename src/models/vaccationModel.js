const mongoose = require('mongoose');
 
const VaccationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    onVaccation:{
        type:Boolean,
        required: [true, 'Please add wether you are on vaccation or not']
    },
    vaccationDays: {
        type:Number,
        required: [true, 'Please add number of vaccation days']
    },
    updatedOn:{
        type:String,
        required: [true, 'Please add a started from']
    },
    startedFrom:{
        type:String,
        required: [true, 'Please add a started from']
    },
});
 
module.exports = mongoose.model(
    'Vaccation', VaccationSchema, "Vaccation");