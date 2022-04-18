const express = require('express');
const router = express.Router();
const { hashPassword, comparePwd } = require('../helpers/bcrypt.helper');
const { createAccessJWT, createRefreshJWT } = require('../helpers/jwt.helper');
const UserData = require('../models/user/User.schema')

router.get('/',(req,res)=>{
    res.json({
        msg:"User router"
    })
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

module.exports = router;