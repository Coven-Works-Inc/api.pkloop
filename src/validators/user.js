const Joi = require('joi');

function validateUser(user){
    const schema = {
        firstname: Joi.string().min(2).max(50).required(),
        lastname: Joi.string().min(2).max(50).required(),
        username: Joi.string().min(2).max(30).required(),
        email: Joi.string().min(5).max(255).email().required(),
        phone: Joi.string().required(),
        password: Joi.string().min(5).max(255).required(),
        confirmpassword: Joi.string().min(5).max(255).required()
    }

    return Joi.validate(user, schema);
}

//@Login Validation - I perform all the login validation for data coming from the client here
//@libraries - I use a library called joi

function validateLogin(user) {
    const schema = {
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(50).required()
    }

    return Joi.validate(user, schema);
    
}

exports.validateUser = validateUser
exports.validateLogin = validateLogin