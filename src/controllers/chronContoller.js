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
  "Friday",
  "Saturday",
];

const today = new Date().toLocaleDateString();
const dayOfWeek = days[new Date().getDay()];

const runChronForStreak = async (req, res) => {
  const sincerelyDone = [];

  // Update tasks

  const taskDetails = await TasksModel.find();

  const listOfTasksToBeCounted = [
    "Goon",
    "6 Pack Abs",
    "FIRE",
    "Hu To Ayvo",
    "Introspection",
    "Project Happy",
    "Read To Grow",
    "Techie",
    "Thank You",
    "Dhun",
  ];

  taskDetails.forEach(async (task) => {
    const { _id, label, repeatOn, checked, reset } = task;

    if (
      listOfTasksToBeCounted.includes(label) &&
      repeatOn.includes(dayOfWeek) &&
      checked == 1
    ) {
      sincerelyDone.push(label);
    }

    const checkForRepeatOn =
      (typeof repeatOn === "string" && repeatOn === today) ||
      repeatOn.includes(dayOfWeek);

    if (reset && checkForRepeatOn) {
      task.checked = typeof checked === "number" ? 0 : [];
      task.repeatOn = typeof repeatOn === "string" ? today : repeatOn;

      const result = await TasksModel.findByIdAndUpdate(_id, task);
    }
  });

  //get details to check if you are on vaccation
  const streakCountDetails = await StreakCountModel.find();
  let streak = streakCountDetails[0]["_doc"];
  let { onVaccation, updatedOn } = streak.onVaccation;
  if (!onVaccation && updatedOn !== today) {
    streak.updatedOn = today;
    streak.activeDays += 1;
    if (!["Saturday", "Sunday"].includes(dayOfWeek)) {
      streak.weekDays += 1;
    }

    sincerelyDone.forEach((todo) => {
      streak.sincerity[todo] += 1;
    });
  }

  const resultStreak = await StreakCountModel.findByIdAndUpdate(
    streak._id.toString(),
    streak
  );

  sendCompleteLog(req, res, StreakCountModel);
};

module.exports = {
  runChronForStreak,
};
