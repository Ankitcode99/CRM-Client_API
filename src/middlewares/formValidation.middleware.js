const Joi = require('joi')

const email = Joi.string().email({
    minDomainSegments: 2, 
    tlds:{allow: ['com','net']
}});

const pin = Joi.number().integer().min(100000).max(999999).required();

const newPassword = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,100}$'))

const resetPasswordRequestValidation = (req,res,next) => {
    const schema = Joi.object({email})

    const value = schema.validate(req.body)
    if(value.error){
        return res.json({
            status:"error",
            message: value.error.message
        })
    }
    next()
}

const updatePasswordValidation = (req,res,next) => {
    const schema = Joi.object({email, pin, newPassword})

    const value = schema.validate(req.body)
    if(value.error){
        return res.json({
            status:"error",
            message: value.error.message
        })
    }
    next()
}

module.exports = {
    resetPasswordRequestValidation,
    updatePasswordValidation
}