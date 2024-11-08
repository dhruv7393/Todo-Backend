const mongoose = require("mongoose");
const copyThatModel = require("../models/copyThatModel");
const VaccationModel = require("../models/vaccationModel");
const checkAndPostMissingField = require("../commonComponents/checkAndPostMissingField");
const sendCompleteLog = require("../commonComponents/sendCompleteLog");
const addLog = require("../commonComponents/addLog");
const deleteById = require("../commonComponents/deleteById");
const updateLog = require("../commonComponents/updateLog");

const getCopyThat = async (req, res) => {
    sendCompleteLog(req, res, copyThatModel);
};

const postCopyThat = async (req, res) => {
    let defaultValue = {
        taskDetail:"",
        importance: 1,
        updatedOn: new Date().toLocaleDateString()
    };
    checkAndPostMissingField(req, res, ["taskName"])
    addLog(req, res, copyThatModel, defaultValue);
};

const patchCopyThat = async (req, res) => {
    let defaultValue = {
        taskDetail:"",
        importance: 1,
        updatedOn: new Date().toLocaleDateString()
    };
    updateLog(req, res, copyThatModel, defaultValue);
};

const deleteCopyThat = async (req, res) => {
    deleteById(req, res, copyThatModel);
};

const updateAllCopyThatEveryDay = async (req, res) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date().toLocaleDateString();
    const day = daysOfWeek[new Date().getDay()]
    const copyThatList = await copyThatModel.find();

    const vaccationDetails = await VaccationModel.find()
    let vaccationValue = vaccationDetails[0]["_doc"]
    const {onVaccation=false, vaccationDays =0} =vaccationValue;


    req.params.id = vaccationValue["_id"]

    vaccationValue.updatedOn !== today && onVaccation && updateLog(req, res, VaccationModel, {"vaccationDays":vaccationDays+1, "updatedOn": today})

    !onVaccation && copyThatList.forEach(async (task) => {
        const {canBeCounted=false, count=0,repeatOn=[], canBeRepeated=false, repeatAfter=1, updatedOn=today} = task
        if(canBeCounted){
            if(today !== updatedOn && daysOfWeek.some(dayname => repeatOn.includes(dayname))){
                task.updatedOn = today
                task.count = count+1
            }
        }
        if(canBeRepeated){
            let result = new Date(updatedOn)
            result = result.setDate(result.getDate() + repeatAfter)
            result = new Date(result).toLocaleDateString()
            if (result === today && today !== updatedOn){
                task.updatedOn = today
                task.done = false
                task.pinned = true
            }
        }
        const result = await copyThatModel.findByIdAndUpdate(task._id, task);
      });

    sendCompleteLog(req, res, copyThatModel);
};

module.exports = {
    getCopyThat,
    postCopyThat,
    patchCopyThat,
    deleteCopyThat,
    updateAllCopyThatEveryDay,
};