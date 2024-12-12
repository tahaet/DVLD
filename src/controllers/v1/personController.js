const fs = require("fs/promises");
const sharp = require("sharp");
const multer = require("multer");
const handlerFactory = require("./handlerFactory");
const Person = require("../../models/person");
const catchHandler = require("../../util/catchHandler");
const AppError = require("../../util/appError");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else cb(new AppError("Please upload only images", 400));
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
exports.uploadPersonPhoto = upload.single("photo");
exports.resizePersonPhoto = catchHandler(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `person-${Math.random().toString("18").slice(2, -1)}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(
      `${__dirname}/../../../public/img/people/${req.file.filename}`,
      (err) => {
        if (err) {
          return next(new AppError("Error processing the image", 500));
        }
      },
    );

  next();
});

exports.deleteImage = catchHandler(async (req, res, next) => {
  const model = await Person.findByPk(req.params.id, { raw: true });
  if (req.file && req.file.filename !== model.image_path) {
    await fs.unlink(
      `${__dirname}/../../../public/img/people/${model.image_path}`,
    );
  }
  next();
});

exports.getAllPeople = handlerFactory.getAll(Person);
exports.createPerson = handlerFactory.createOne(Person);
exports.getPersonById = handlerFactory.getOneById(Person);
exports.updatePerson = handlerFactory.updateOne(Person);
exports.deletePerson = handlerFactory.deleteOne(Person);
exports.getBy = handlerFactory.getOneBy(Person);
