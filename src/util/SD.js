class ApplicationTypes {
  static new_Local_driving_license_service = 1;
  static renew_driving_license_service = 2;
  static replacement_for_lost_driving_license = 3;
  static replacement_for_damaged_driving_license = 4;
  static release_detained_driving_license = 5;
  static new_international_driving_license_service = 6;
  static retake_test = 7;
}
class TestType {
  static VISION_TEST = 1;
  static THEORY_TEST = 2;
  static PRACTICAL_TEST = 3;
}
class ApplicationStatus {
  static APPROVED = 1;
  static CANCELLED = 2;
  static COMPLETED = 3;
}
exports.IssueReason = Object.freeze({
  FirstTime: 1,
  Renew: 2,
  DamagedReplacement: 3,
  LostReplacement: 4,
});
exports.ApplicationTypes = ApplicationTypes;
exports.TestType = TestType;
exports.ApplicationStatus = ApplicationStatus;
