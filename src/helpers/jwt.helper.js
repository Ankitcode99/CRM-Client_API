const jwt = require('jsonwebtoken')
const {setJWT, getJWT} = require('./redis.helper')
const UserData = require('../models/user/User.schema')

const createAccessJWT = async (email, _id) =>{
    try {
        const accessJWT = jwt.sign({email},process.env.JWT_ACCESS_SECRET,{expiresIn: '1d'})
    
        await setJWT(accessJWT, _id)
        console.log("Access token added to redis")
        return Promise.resolve(accessJWT)
    } catch (error) {
        return Promise.reject(error);
    }
}

const createRefreshJWT = async (email, _id) => {
    try {
        const refreshJWT = jwt.sign({email}, process.env.JWT_REFRESH_SECRET,{expiresIn:'30d'})
        //await setJWT(refreshJWT, payload)
        await UserData.findOneAndUpdate({_id: _id},{ $set:{"refreshJWT.token":refreshJWT, "refreshJWT.addedAt": Date.now()}})
        return Promise.resolve(refreshJWT)
        
    } catch (error) {
        return Promise.reject(error);
    }
}

const verifyAccessJWT = (userJWT) => {
    try {
        return Promise.resolve(jwt.verify(userJWT, process.env.JWT_ACCESS_SECRET))
    } catch (error) {
        return Promise.resolve(error)
    }
}

const verifyRefreshJWT = (userJWT) => {
    try {
        return Promise.resolve(jwt.verify(userJWT, process.env.JWT_REFRESH_SECRET))
    } catch (error) {
        return Promise.resolve(error)
    }
}

module.exports = {
    createAccessJWT,
    createRefreshJWT,
    verifyAccessJWT,
    verifyRefreshJWT
}