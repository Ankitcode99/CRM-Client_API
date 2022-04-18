const redis = require('redis')

const client = redis.createClient(process.env.REDIS_URL);

client.on("error",(err)=>{
    console.log(err);
})

const setJWT = (key, value) => {
    try {     
        return new Promise((resolve,reject)=>{
            client.set(key,value, (err,res)=>{
                if(err) reject(err)
                resolve(res);
            })
        })
    } catch (error) {
        reject(error)
    }
}

const getJWT = (key) => {
    try {     
        return new Promise((resolve,reject)=>{
            client.get(key, (err,res)=>{
                if(err) reject(err)
                resolve(res);
            })
        })
    } catch (error) {
        reject(error)
    }
}

module.exports = {
    setJWT,
    getJWT
}