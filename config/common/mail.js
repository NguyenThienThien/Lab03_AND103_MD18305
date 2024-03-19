var modemailer = require('nodemailer');
const transporter = modemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'thien2k4pro@gmail.com',
        pass: "qomo imsv uamy bfug"
    },
});

module.exports = transporter;