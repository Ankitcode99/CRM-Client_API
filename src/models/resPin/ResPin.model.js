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

module.exports = {
    setResetPasswordPin
}