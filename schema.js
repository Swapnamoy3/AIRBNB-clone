const joi = require("joi")

const listingSchema = joi.object({
        title: joi.string().required(),
        description : joi.string(),
        price: joi.number().min(0),
        location : joi.string().required(),
        country: joi.string(),
        image: joi.string().allow("",null)
    }).required()

    
const reviewSchema = joi.object({
    rating: joi.number().required().min(1).max(5),
    comment: joi.string().required(),
    createdAt: joi.date()
}).required()

module.exports = {listingSchema,reviewSchema};