const express = require('express');
const router = express.Router();
const { hashPassword, comparePwd } = require('../helpers/bcrypt.helper');
const { createAccessJWT, createRefreshJWT } = require('../helpers/jwt.helper');
const UserData = require('../models/user/User.schema')
const {userAuthorization} = require('../middlewares/authorization.middleware');
const { setResetPasswordPin, getPinByEmailPin, deletePin } = require('../models/resPin/ResPin.model');
const { emailProcesser } = require('../helpers/email.helper');
const { updatePassword } = require('../models/user/User.model');
const { resetPasswordRequestValidation, updatePasswordValidation } = require('../middlewares/formValidation.middleware');

router.get('/',userAuthorization, async (req,res)=>{

    const _id = req.userID;
    try {
        const secretData = await UserData.findById(_id)
    
        res.json({
            msg:"User router",
            secretData
        })
    } catch (error) {
        res.json({
            msg:error.message
        })
    }
})

router.post('/',async(req,res)=>{
    const {password} = req.body;
    console.log(password);

    try {
        const hashedPass = await hashPassword(password)
        req.body.password = hashedPass;
        // console.log(req.body);
        const result = await UserData.create(req.body);
        res.json({
            message:"New user created!",
            result
        });        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

router.post('/login',async (req,res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        res.json({
            status:"error",
            message:"Invalid form submission"
        })
    }

    const data = await UserData.findOne({ email:email });
    const passFromDb = data ? data.password : null;

    if(!passFromDb){
        res.json({
            status:"error",
            message:"No user with given credentials!"
        })
    }else{
        const passwordCheck = await comparePwd(password,passFromDb);
        if(passwordCheck){
            const accessJWT = await createAccessJWT(email, `${data._id}`);
            const refreshJWT = await createRefreshJWT(email, data._id);

            
            res.status(200).json({
                msg:"Sign in successful",
                accessJWT,
                refreshJWT
            })
        }else{
            res.status(401).json({
                msg:"Invalid credentials!"
            });
        }
    }

})

router.post('/reset-password', resetPasswordRequestValidation, async(req,res)=>{
    const {email} = req.body;
    const user = await UserData.findOne({ email:email });
    console.log(user)
    if(user && user._id){
        const setPin = await setResetPasswordPin(email);
        await emailProcesser(email,setPin.pin,"request-new-pass")
            return res.status(200).json({
                status:"success",
                message:"The password reset link will be sent shortly if the email is valid"
            })   
    }
        res.json({
            status:"error",
            message:"The password reset link will be sent shortly if the email is valid"
        })
    
})

router.patch('/reset-password', updatePasswordValidation,async(req,res)=>{
    const {email, pin, newPassword} = req.body;

    const result = await getPinByEmailPin(email, pin);
    if(result && result.email){
        const dbDate = result.addedAt;
        const expiryDate = dbDate.setDate(dbDate.getDate() + 1);
        const today = new Date()
        if(today > expiryDate){
            return res.json({
                status:"error",
                message:"Invalid or expired pin"
            })
        }

        const hashedPass = await hashPassword(newPassword);

        const user = await updatePassword(email, hashedPass)

        await emailProcesser(email, pin, "password-update-success")
        await deletePin(email, pin)
        if(user._id){
            return res.json({
                status:"success",
                message:"Passowrd updated successfully!"
            })
        }
    }

    res.json({
        status:"error",
        message:"Unable to update your password, please try again later!"
    })

})

module.exports = router;