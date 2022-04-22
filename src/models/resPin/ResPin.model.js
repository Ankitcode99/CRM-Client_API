const { off } = require('./ResPin.schema');
const ResetPinSchema = require('./ResPin.schema');
//const UserData = require('./User.schema');

const setResetPasswordPin = async (email) => {
    const randPin = () => {
        var minm = 100000;
        var maxm = 999999;
        return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    }

    const resetObj = {
        email,
        pin: randPin()
    }

    const res = await ResetPinSchema.create(resetObj)
    return res;
}

const getPinByEmailPin = async (email,pin) => {
    return new Promise((resolve,reject)=>{
        try {
            ResetPinSchema.findOne({ email, pin},(error,res)=>{
                if(error){
                    console.log(error);
                    resolve(false);
                }
    
                resolve(res);
            })
        } catch (error) {
            reject(error)
            console.log(error)
        }
    })
}

const deletePin = async(email,pin) => {
    return new Promise((resolve,reject)=>{
        try {
            ResetPinSchema.findOneAndDelete({email, pin},(error,res)=>{
                if(error){
                    console.log(error)
                    resolve(false)
                }
            })
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })
}

module.exports = {
    setResetPasswordPin,
    getPinByEmailPin,
    deletePin
}