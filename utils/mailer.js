var _ = require('lodash');   
var nodemailer = require('nodemailer');

// Use environment variables for sensitive information
var config = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user:'kumaravnish284@gmail.com', // Defined in .env
        pass: 'ctmq cdzk uaqn aful'  // Defined in .env
    }
};

var transporter = nodemailer.createTransport(config);

// Improved send function
const send = async (to, cc,subject, html) => {
    // Ensure mail is properly scoped and use default settings
    let mail = _.merge({}, defaultMail, {to, cc,subject, html});

    try {
        let info = await transporter.sendMail(mail);
        console.log('Mail sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending mail:', error);
        throw error; // Allows caller to handle the error
    }
};

module.exports = {
    send
};
