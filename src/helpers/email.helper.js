const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'kory.herzog70@ethereal.email',
        pass: 'gqJXEkTfexKQ3YA4w9'
    }
});

const send =  (infor) => {
    return new Promise(async(resolve,reject)=>{
        try {
            let info = await transporter.sendMail(infor);
            
            console.log("Message sent: %s", info.messageId);
            
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            resolve(info);
        } catch (error) {
            console.log(error)
        }
    })
}

const emailProcesser = (email, pin, type) => {
    let info = ``
    switch(type){
        case "request-new-pass":
            info = {
                from: '"CRM Cloud" kory.herzog70@ethereal.email', // sender address
                to: email,
                subject: "Password reset pin for CRM Cloud", // Subject line
                text: "Here's your password reset pin "+pin+", this pin will expire in 24 hours", // plain text body
                html: `<b>Hello,</b><br/>
                Here's your password reset pin <p>${pin}</p>, this pin will expire in 24 hours`, // html body
            }
            send(info);
            break;
        case "password-update-success":
            info = {
                from: '"CRM Cloud" kory.herzog70@ethereal.email', // sender address
                to: email,
                subject: "Password updated successfully", // Subject line
                text: "Hi, your new password has been updated", // plain text body
                html: `Hi, your new password has been updated`, // html body
            }
            send(info);
            break;
        default:console.log("Invalid email processor")
    }
}

module.exports = {
    emailProcesser
}