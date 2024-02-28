/*
    @desc Delete all entries by Id
*/
const deleteById = async (req, res, model) => {
  const { id } = req.params;
  try {
    const logs = await model.findByIdAndDelete(id);
    if (!logs) {
      res
        .status(400)
        .send("ID " + id + "could not be deleted as no logs found");
    }
    res.status(200).send(`${id} removed`);
  } catch (e) {
    res
      .status(400)
      .json(
        "Requested deleteion for id - " +
          id +
          " could not be completed. Please find detailed error - ",
        e
      );
  }
};

module.exports = deleteById;
