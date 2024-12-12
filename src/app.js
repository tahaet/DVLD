const express = require("express");
const path = require("path");
const cors = require("cors");
const AppError = require("./util/appError");
const globalErrorHandler = require("./controllers/v1/errorController");
const countryRouter = require("./routes/countryRoutes");
const personRouter = require("./routes/personRoutes");
const userRouter = require("./routes/userRoutes");
const licenseClassRouter = require("./routes/licenseClassRoutes");
const applicationTypeRouter = require("./routes/applicationTypeRoutes");
const applicationRouter = require("./routes/applicationRoutes");
const LocalDrivingLicenseApplicationRouter = require("./routes/localDrivingLicenseApplicationRoutes");
const authController = require("./controllers/v1/authController");
const testAppointmentRouter = require("./routes/testAppointmentRoutes");
const testRouter = require("./routes/testRoutes");
const licenseRouter = require("./routes/licenseRoutes");
const internationalLicenseRouter = require("./routes/internationalLicenseRoutes");

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use(authController.protect);
app.use("/api/v1/countries", countryRouter);
app.use("/api/v1/license_classes", licenseClassRouter);
app.use("/api/v1/people", personRouter);
app.use("/api/v1/application_types", applicationTypeRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/test_appointments", testAppointmentRouter);
app.use("/api/v1/tests", testRouter);
app.use("/api/v1/licenses", licenseRouter);
app.use("/api/v1/international_licenses", internationalLicenseRouter);
app.use(
  "/api/v1/local_driving_license_applications",
  LocalDrivingLicenseApplicationRouter,
);

app.all("*", (err, req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
