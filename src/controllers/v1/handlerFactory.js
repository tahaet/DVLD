const AppError = require("../../util/appError");
const APIFeatures = require("../../util/apiFeatures");
const catchHandler = require("../../util/catchHandler");
const Application = require("../../models/application");

exports.createOne = (Model) =>
  catchHandler(async (req, res, next) => {
    if (req.file && req.file.filename) req.body.image_path = req.file.filename;
    const model = await Model.create(req.body, { validator: true });
    if (model?.application_type_id === 1) {
      req.body.application_id = model.application_id;

      return next();
    }
    res.status(201).json({
      status: "success",
      data: {
        [Model.name.toLowerCase()]: model,
      },
    });
  });

exports.getOneById = (Model) =>
  catchHandler(async (req, res, next) => {
    const model = await Model.findByPk(req.params.id, {
      raw: true,
      nest: true,
    });
    if (!model) {
      return next(
        new AppError(
          `There is no record associated with this id ${req.params.id}`,
          404,
        ),
      );
    }
    res.status(200).json({
      status: "success",
      data: {
        [Model.name.toLowerCase()]: model,
      },
    });
  });

exports.getOneBy = (Model, options) =>
  catchHandler(async (req, res, next) => {
    const filter = new APIFeatures(Model, req.query, options).filter();
    const model = (await filter.execute())[0];
    if (!model) {
      return next(
        new AppError(
          `There is no record associated with this id ${req.query}`,
          404,
        ),
      );
    }
    res.status(200).json({
      status: "success",
      data: {
        [Model.name.toLowerCase()]: model,
      },
    });
  });

// exports.getOneByQueryString = (Model) =>
//   catchHandler(async (req, res, next) => {
//     const model = Model.findOne({
//       where: { [Op.eq]: { country_name: req.query.name } },
//     });
//   });
exports.getAll = (Model) =>
  catchHandler(async (req, res, next) => {
    // Apply APIFeatures if you have a custom implementation for Sequelize
    const features = new APIFeatures(Model, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const models = await features.execute();

    res.status(200).json({
      status: "success",
      results: models.length,
      data: {
        [`${/[^aeiou]y$/i.test(Model.name.toLowerCase()) ? `${Model.name.toLowerCase().slice(0, -1)}ies` : `${Model.name.toLowerCase()}s`}`]:
          models,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchHandler(async (req, res, next) => {
    const model = await Model.destroy({
      where: { [Model.primaryKeyAttribute]: req.params.id },
    });

    if (!model) {
      return next(
        new AppError(
          `There is no record associated with this id ${req.params.id}`,
          404,
        ),
      );
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchHandler(async (req, res, next) => {
    const model = await Model.findByPk(req.params.id);

    if (!model) {
      return next(new AppError("No record found with that ID", 404));
    }

    await model.update(req.body); // Update instance with new data

    res.status(200).json({
      status: "success",
      data: {
        [Model.name.toLowerCase()]: model,
      },
    });
  });
