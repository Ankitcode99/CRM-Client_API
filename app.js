require('dotenv').config({path:'./config/config.env'});
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const PORT = process.env.PORT;
const connectDB = require('./db');

app.use(cors());
if(process.env.NODE_ENV !== 'production') {
    app.use(morgan("tiny"));
}
if(process.env.NODE_ENV=='production')app.use(helmet());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
connectDB()

app.use('/v1/user',require('./src/routers/user.router'));
app.use('/v1/ticket',require('./src/routers/ticket.router'))
app.use('/v1/token',require('./src/routers/token.router'))

const handleError = require('./src/utils/errorHandler');
// if no route exist
app.use('*',(req,res,next)=>{
    const error = new Error("404 Not Found!");
    error.status= 404;
    next(error);
})

app.use('*',(error, req, res, next)=>{
    handleError(error,res);
})



app.listen(PORT,()=>console.log(`I'm on at PORT ${PORT}`));