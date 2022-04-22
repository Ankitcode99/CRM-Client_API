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

const updatePassword = (email, newPassword) => {
    return new Promise((resolve, reject)=>{
        try {
            UserSchema.findOneAndUpdate({email},{$set:{"password": newPassword}},{new: true})
            .then((data) => resolve(data))
            .catch((error)=>{
                console.log(error);
                reject(error)
            })
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

module.exports = {
    insertUser,
    getUserByEmail,
    updatePassword
}