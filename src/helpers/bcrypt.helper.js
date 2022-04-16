const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = plainPassword => {
    return new Promise((resolve,reject)=>{
        resolve(bcrypt.hashSync(plainPassword,saltRounds))
    })
}

const comparePwd = (plainPassword, passFromDB) => {
    return new Promise((resolve, reject)=>{
        bcrypt.compare(plainPassword,passFromDB,(err,res)=>{
            if(err) reject(err);

            resolve(res);
        })
    })
}

module.exports = {
    hashPassword,
    comparePwd
}