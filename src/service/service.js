const { QueryTypes } = require("sequelize");
const sequelize = require("../sequelize/sequelize");
const SD = require("../util/SD");

exports.doesPassTestType = async (
  local_driving_license_application_id,
  test_type_id,
) => {
  const result = await sequelize.query(
    `
      SELECT TOP 1 tests.test_result
      FROM local_driving_license_applications
      INNER JOIN test_appointments 
        ON local_driving_license_applications.local_driving_license_application_id = test_appointments.local_driving_license_application_id
      INNER JOIN tests 
        ON test_appointments.test_appointment_id = tests.test_appointment_id
      WHERE local_driving_license_applications.local_driving_license_application_id = :localDrivingLicenseApplicationID
        AND test_appointments.test_type_id = :testTypeID
      ORDER BY test_appointments.test_appointment_id DESC
      `,
    {
      replacements: {
        localDrivingLicenseApplicationID: local_driving_license_application_id,
        testTypeID: test_type_id,
      },
      type: QueryTypes.SELECT,
    },
  );
  return result[0]?.test_result;
};
exports.doesAttendTestType = async (
  local_driving_license_application_id,
  test_type_id,
) => {
  const result = await sequelize.query(
    `
      SELECT TOP 1 1 AS found
      FROM local_driving_license_applications
      INNER JOIN test_appointments 
        ON local_driving_license_applications.local_driving_license_application_id = test_appointments.local_driving_license_application_id
      INNER JOIN tests 
        ON test_appointments.test_appointment_id = tests.test_appointment_id
      WHERE local_driving_license_applications.local_driving_license_application_id = :localDrivingLicenseApplicationID
        AND test_appointments.test_type_id = :testTypeID
      ORDER BY test_appointments.test_appointment_id DESC
      `,
    {
      replacements: {
        localDrivingLicenseApplicationID: local_driving_license_application_id,
        testTypeID: test_type_id,
      },
      type: QueryTypes.SELECT,
    },
  );

  return result.length > 0;
};
exports.totalTrialsPerTest = async (
  local_driving_license_application_id,
  test_type_id,
) => {
  const result = await sequelize.query(
    `
      SELECT COUNT(tests.test_id) AS total_trials_per_test
      FROM local_driving_license_applications
      INNER JOIN test_appointments 
        ON local_driving_license_applications.local_driving_license_application_id = test_appointments.local_driving_license_application_id
      INNER JOIN tests 
        ON test_appointments.test_appointment_id = tests.test_appointment_id
      WHERE local_driving_license_applications.local_driving_license_application_id = :localDrivingLicenseApplicationID
        AND test_appointments.test_type_id = :testTypeID
      `,
    {
      replacements: {
        localDrivingLicenseApplicationID: local_driving_license_application_id,
        testTypeID: test_type_id,
      },
      type: QueryTypes.SELECT,
    },
  );

  return result[0]?.total_trials_per_test || 0;
};
// exports.doesPersonHasActiveApplication = async (
//   applicant_person_id,
//   application_type_id,
//   license_class_id,
// ) => {
//   const result = await sequelize.query(
//     `select top 1 result=1 from applications where `,
//   );
// };
exports.isThereAnActiveScheduledTest = async (
  local_driving_license_application_id,
  test_type_id,
) => {
  const result = await sequelize.query(
    `
      SELECT TOP 1 1 AS found
      FROM local_driving_license_applications
      INNER JOIN test_appointments 
        ON local_driving_license_applications.local_driving_license_application_id = test_appointments.local_driving_license_application_id
      WHERE 
        local_driving_license_applications.local_driving_license_application_id = :localDrivingLicenseApplicationId 
        AND test_appointments.test_type_id = :testTypeId 
        AND test_appointments.is_locked = 0
      ORDER BY test_appointments.test_appointment_id DESC
      `,
    {
      type: QueryTypes.SELECT,
      replacements: {
        localDrivingLicenseApplicationId: local_driving_license_application_id,
        testTypeId: test_type_id,
      },
    },
  );

  return result.length > 0;
};
exports.doesPassPreviousTestType = async (
  local_driving_license_application_id,
  test_type_id,
) => {
  if (test_type_id === SD.TestType.VISION_TEST) return true;
  if (test_type_id === SD.TestType.THEORY_TEST)
    return await this.doesPassTestType(
      local_driving_license_application_id,
      SD.TestType.VISION_TEST,
    );
  else
    return await this.doesPassTestType(
      local_driving_license_application_id,
      SD.TestType.THEORY_TEST,
    );
};

exports.doesPassAllTests = async (local_driving_license_application_id) => {
  const result = await sequelize.query(
    `
    SELECT COUNT(test_type_id) AS passed_test_count
    FROM tests 
    INNER JOIN test_appointments ON tests.test_appointment_id = test_appointments.test_appointment_id
    WHERE local_driving_license_application_id = :localDrivingLicenseApplicationId 
    AND test_result = 1
    `,
    {
      type: QueryTypes.SELECT,
      replacements: {
        localDrivingLicenseApplicationId: local_driving_license_application_id,
      },
    },
  );

  return result[0]?.passed_test_count === 3;
};
