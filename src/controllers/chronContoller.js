const mongoose = require("mongoose");
const TasksModel = require("../models/TasksModel");
const StreakCountModel = require("../models/streakCountModel");
const checkAndPostMissingField = require("../commonComponents/checkAndPostMissingField");
const sendCompleteLog = require("../commonComponents/sendCompleteLog");
const addLog = require("../commonComponents/addLog");
const deleteById = require("../commonComponents/deleteById");
const updateLog = require("../commonComponents/updateLog");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Fiday",
  "Saturday",
];

const today = new Date().toLocaleDateString();
const prevDay = days[new Date().getDay() - 1 < 0 ? 6 : new Date().getDay() - 1];
const dayOfWeek = days[new Date().getDay()];

const getInitialStreakData = async (req, res) => {
  //get details to check if you are on vaccation
  const streakCountDetails = await StreakCountModel.find();
  let streak = streakCountDetails[0]["_doc"];
  let { onVaccation, updatedOn } = streak.onVaccation;
  if (!onVaccation && updatedOn !== today) {
    streak.updatedOn = today;
    streak.activeDays += 1;
    if (dayOfWeek !== "Sunday" || dayOfWeek !== "Saturday") {
      streak.weekDays += 1;
    }
  }

  // get details of tasks to be carried out daily
  const taskDetailsNitya = await TasksModel.findById(
    "67f58c5d0b3ae40bdb5b3438"
  );
  const taskDetailsWeekly = await TasksModel.findById(
    "67f58d060b3ae40bdb5b343e"
  );
  const sincerelyDone = [];

  if (taskDetailsNitya.repeatOn.includes(prevDay)) {
    sincerelyDone.push(...taskDetailsNitya.checked);
  }
  if (taskDetailsWeekly.repeatOn.includes(prevDay)) {
    sincerelyDone.push(...taskDetailsWeekly.checked);
  }

  // add to sincerely done
  if (updatedOn !== today) {
    sincerelyDone.forEach((todo) => {
      streak.sincerity[todo] += 1;
    });
  }

  return streak;
};

const resetTaskForToday = async (req, res) => {
  const taskDetails = await TasksModel.find();

  taskDetails.forEach(async (task) => {
    const { _id, repeatOn, checked, reset } = task;
    const checkForRepeatOn =
      (typeof repeatOn === "string" && new Date(repeatOn) <= new Date(today)) ||
      repeatOn.includes(dayOfWeek);

    if (reset && checkForRepeatOn) {
      task.checked = typeof checked === "number" ? 0 : [];
      task.repeatOn = typeof repeatOn === "string" ? today : repeatOn;
      const result = await TasksModel.findByIdAndUpdate(_id, task);
    }
  });
};

const runChron = async (req, res) => {
  // get and update streak count values
  const updatedStreakValue = await getInitialStreakData(req, res);
  const resultStreak = await StreakCountModel.findByIdAndUpdate(
    updatedStreakValue._id,
    updatedStreakValue
  );
  await resetTaskForToday(req, res);
  sendCompleteLog(req, res, StreakCountModel);
};

module.exports = {
  runChron,
};
