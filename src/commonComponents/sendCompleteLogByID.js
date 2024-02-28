/*
    @desc Get all entries by Id
*/
const sendCompleteLogById = async (req, res, model) => {
  const { id } = req.params;
  try {
    const logs = await model.findById(id);
    res.status(200).json(logs);
  } catch (e) {
    res
      .status(400)
      .json(
        "Requested data for id - " +
          id +
          " not found. Please find detailed error - ",
        e
      );
  }
};

module.exports = sendCompleteLogById;
