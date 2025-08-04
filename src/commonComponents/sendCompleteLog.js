/*
    @desc Get all entries
*/
const sendCompleteLog = async (req, res, model) => {
  try {
    const logs = await model.find();
    res.status(200).json(logs);
  } catch (e) {
    res.status(500).json({
      error: "Requested data is not available",
      message: e.message || "Internal server error",
      details: e,
    });
  }
};

module.exports = sendCompleteLog;
