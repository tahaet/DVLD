const ApplicationType = require("../../models/applicationType");
const handlerFactory = require("./handlerFactory");

exports.getOneApplicationType = handlerFactory.getOneById(ApplicationType);
exports.getAllApplicationTypes = handlerFactory.getAll(ApplicationType);
exports.createApplicationType = handlerFactory.createOne(ApplicationType);
exports.deleteApplicationType = handlerFactory.deleteOne(ApplicationType);
exports.updateApplicationType = handlerFactory.updateOne(ApplicationType);
// exports.setQueryString = (req,res,next)=>{
//     req.query.
// }
