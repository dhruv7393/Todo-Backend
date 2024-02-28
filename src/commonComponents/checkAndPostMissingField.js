const checkAndPostMissingField = (
  req,
  res,
  arrayOfFieldsInBody,
  arrayOfFieldsInParam = []
) => {
  let missingFieldsInParam = [];
  arrayOfFieldsInParam.length &&
    arrayOfFieldsInParam.forEach((field) => {
      if (!Object.keys(req.params).includes(field)) {
        missingFieldsInParam.push(field);
      }
    });

  let missingFieldsInBody = [];
  arrayOfFieldsInBody.length &&
    arrayOfFieldsInBody.forEach((field) => {
      if (!Object.keys(req.body).includes(field)) {
        missingFieldsInBody.push(field);
      }
    });

  if (missingFieldsInParam.length || missingFieldsInBody.length) {
    res
      .status(400)
      .send(
        `${missingFieldsInBody.join(
          ", "
        )} are missing in body and ${missingFieldsInParam.join(
          ", "
        )} are missing in param`
      );
  }
};

module.exports = checkAndPostMissingField;
