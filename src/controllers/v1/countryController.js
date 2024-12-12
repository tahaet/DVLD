const Country = require("../../models/country");
const handlerFactory = require("./handlerFactory");

exports.getOneCountry = handlerFactory.getOneById(Country);
exports.getAllCountries = handlerFactory.getAll(Country);
exports.createCountry = handlerFactory.createOne(Country);
exports.deleteCountry = handlerFactory.deleteOne(Country);
exports.updateCountry = handlerFactory.updateOne(Country);
// exports.setQueryString = (req,res,next)=>{
//     req.query.
// }
