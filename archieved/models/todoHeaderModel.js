const mongoose = require('mongoose');
 
const ToDoHeaderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type:String,
        required: [true, 'Please add a text value']
    },
    pinned: {
        type:Boolean,
        required: [true, 'Please check if pinned or not']
    }
});
 
module.exports = mongoose.model(
    'ToDoHeaders', ToDoHeaderSchema, "Header");