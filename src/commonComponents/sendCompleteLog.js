/*
    @desc Get all entries
*/
const sendCompleteLog = async (req, res, model) => {
  try {
    const logs = await model.find();
    res.status(200).json(logs);
  } catch (e) {
    res
      .status(400)
      .json(
        "Requested data is not available. Please find detailed error - ",
        e
      );
  }
};

module.exports = sendCompleteLog;
