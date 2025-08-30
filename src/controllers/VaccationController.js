const mongoose = require("mongoose");
const VaccationModel = require("../models/VaccationModel");
const {
  sortToDos,
  addCategory,
  getModifiedCategories,
  chron,
} = require("dhruvtodo");

const deleteCategoryByIDs = async (ids) => {
  try {
    const result = await VaccationModel.deleteMany({ _id: { $in: ids } });
    return result;
  } catch (error) {
    throw error;
  }
};

const getEntireTaskData = async () => {
  try {
    const data = await VaccationModel.find();
    return sortToDos(data);
  } catch (error) {
    throw error;
  }
};

const getCategoryByID = async (id) => {
  try {
    const data = await VaccationModel.findById(id);
    return sortToDos(data);
  } catch (error) {
    throw error;
  }
};

const updateMultipleCategories = async (categories) => {
  try {
    const updatePromises = categories.map((category) => {
      const { _id, ...updateData } = category;
      return VaccationModel.findByIdAndUpdate(_id, updateData, { new: true });
    });

    const results = await Promise.all(updatePromises);
    return results;
  } catch (error) {
    throw error;
  }
};

const getAllVaccationTasks = async (req, res) => {
  try {
    const data = await getEntireTaskData();
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

const getVaccationByID = async (req, res) => {
  try {
    const data = await getCategoryByID(req.params.id);
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

const addVaccationCategory = async (req, res) => {
  try {
    const existingData = await getEntireTaskData();

    const categoryToBeCreated = {
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name || "Untitled Category",
      color: req.body.color || "Untitled Category",
      border: req.body.border || "#ffffff",
      done: 0,
      notDone: 0,
      total: 0,
      isMarkedDone: false,
      priority: existingData.length + 1,
      tasks: [],
    };

    const dataFromAddCategory = addCategory(
      existingData,
      categoryToBeCreated._id,
      categoryToBeCreated.name,
      categoryToBeCreated.color,
      categoryToBeCreated.border
    );

    const categoriesToBeUpdated = dataFromAddCategory.filter(
      (category) => category._id !== categoryToBeCreated._id.toString()
    );

    const newCategory = dataFromAddCategory.filter(
      (category) => category._id === categoryToBeCreated._id.toString()
    );

    const result = await VaccationModel.create(newCategory[0]);

    categoriesToBeUpdated.length &&
      updateMultipleCategories(categoriesToBeUpdated);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

const updateVaccations = async (req, res) => {
  try {
    const updatedData = await updateMultipleCategories(req.body);
    res.status(200).json({
      success: true,
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

const deleteVaccation = async (req, res) => {
  console.log("Delete request received with ID:", req.body.ids);
  try {
    const result = await deleteCategoryByIDs(req.body.ids);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

const cron = async (req, res) => {
  try {
    // Get existing data and make a deep copy
    const existingData = await getEntireTaskData();
    const dataCopy = JSON.parse(JSON.stringify(existingData));
    let existingDataCategoryIDs = existingData.map((cat) => cat._id);
    // Run chron function on the data
    const result = chron(dataCopy);
    let resultCategoryIDs = result.map((cat) => cat._id);

    let categoriesToBeDeleted = existingDataCategoryIDs.filter(
      (id) => !resultCategoryIDs.includes(id)
    );

    await deleteCategoryByIDs(categoriesToBeDeleted);

    updateMultipleCategories(result);

    res.status(200).json({
      success: true,
      message: "Cron ran successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

module.exports = {
  getAllVaccationTasks,
  getVaccationByID,
  addVaccationCategory,
  updateVaccations,
  deleteVaccation,
  cron,
};
