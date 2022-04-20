const express = require('express');
const { verifyRefreshJWT, createAccessJWT } = require('../helpers/jwt.helper');
const UserData = require('../models/user/User.schema');
const router = express.Router();

/**
 * steps followed for creation of new access token upon expiration
 * 1. Check for validity of refresh token
 * 2. Check if refresh jwt exist in DB
 */
router.get('/',async (req,res,next)=>{

    const {authorization} = req.headers
    const decoded = await verifyRefreshJWT(authorization)
    if(decoded.email){
        const user = await UserData.findOne({email: decoded.email})
        if(user._id){
            // res.json({user.refreshJWT})
            let tokenExp = user.refreshJWT.addedAt;
            const dbRefreshToken = user.refreshJWT.token;

            tokenExp = tokenExp.setDate(
                tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
            )

            const today = new Date();

            if(today > tokenExp && dbRefreshToken!==authorization){
                // refresh JWT expired
                res.status(403).json({message:"Forbidden"})
            }
            

            const accessJWT = await createAccessJWT(decoded.email,`${user._id}`)
            
            res.status(200).json({
                msg:"Success",
                accessJWT:accessJWT
            })
        }
    }
    res.json({
        decoded
    })    
})

module.exports = router;