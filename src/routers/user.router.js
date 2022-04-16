const express = require('express');
const router = express.Router();
const {insertUser} = require('../models/user/User.model')
const { hashPassword } = require('../helpers/bcrypt.helper');

router.get('/',(req,res)=>{
    res.json({
        msg:"User router"
    })
})

// to check existence of any earlier user we create index on EMAIL-ID of the user
router.post('/',async(req,res)=>{
    const {password} = req.body;
    console.log(password);

    try {

        const hashedPass = await hashPassword(password)
        req.body.password = hashedPass
        console.log(req.body);
        const result = await insertUser(req.body);
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

module.exports = router;