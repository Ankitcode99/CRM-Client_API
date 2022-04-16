const UserSchema = require('./User.schema');
//const UserData = require('./User.schema');

const insertUser = userObj => {
    return new Promise((resolve,reject)=>{
        UserSchema(userObj).save()
            .then(data => resolve(data))
            .catch(err => reject(err));
    })
}

const getUserByEmail = email => {
    if(!email) return false;
    return new Promise((resolve,reject)=>{
        UserData.findOne({email},(error,data)=>{
            if(error){
                reject(error);
            }else{
                resolve(data);
            }
        })
    })
}

module.exports = {
    insertUser,
    getUserByEmail
}