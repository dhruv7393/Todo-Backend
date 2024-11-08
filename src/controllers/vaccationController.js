const mongoose = require("mongoose");

const VaccationModel = require("../models/vaccationModel");
const sendCompleteLog = require("../commonComponents/sendCompleteLog");
const updateLog = require("../commonComponents/updateLog");

const getVaccation = async (req, res) => {
  sendCompleteLog(req, res, VaccationModel);
};

const updateVaccation = async(req, res)=>{
  const vaccationDetails = await VaccationModel.find()
  let defaultValue = vaccationDetails[0]["_doc"]
  defaultValue["updatedOn"] = new Date().toLocaleDateString()
  const {onVaccation=defaultValue.onVaccation, vaccationDays = defaultValue.vaccationDays, updatedOn=new Date().toLocaleDateString()} = req.body;
  const { id } = req.params;
  updateLog(req, res, VaccationModel, defaultValue);
}


module.exports = {
  getVaccation,
  updateVaccation
};
