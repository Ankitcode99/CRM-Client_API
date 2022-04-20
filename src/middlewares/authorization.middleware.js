const {verifyAccessJWT} = require('../helpers/jwt.helper')
const {getJWT, deleteJWT} = require('../helpers/redis.helper')

const userAuthorization = async (req,res,next) =>{
    const {authorization} = req.headers;
    
    const decoded = await verifyAccessJWT(authorization)
    if(decoded.email){
        const userId = await getJWT(authorization)

        if(!userId){
            return res.status(403).json({
                message:"Forbidden"
            })
        }
        req.userID = userId;

        return next()
    }

    //access jwt is expired so delete from redis DB
    deleteJWT(authorization)

    return res.status(403).json({
                message:"Forbidden"
            })
    // res.json(decoded)
}

module.exports = {
    userAuthorization
}