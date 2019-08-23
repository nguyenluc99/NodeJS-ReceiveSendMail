// var nodemailer = require('nodemailer');
// var xoauth2 = require('xoauth2')
// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     // host: 'lucnguyenvan@bigmax.vn',
//     secure: false,
//     // port: 465,
//     auth: {
//         type: xoauth2, //Authentication type
//         Username: 'lucnguyenvan@bigmax.vn', //For example, xyz@gmail.com
//         Password: 'nguyenluc99',
//         clientId: '114875371228995663709',
//         clientSecret: 'mEax79CGqUVtEis9bxBETSkT',
//     },
//     // Authentication: 'AUTH PLAIN',
//     tls: {
//         rejectUnauthorized: false
//     }
// });

// // var mailOptions = {
// //     from: 'lucnguyenvan@bigmax.vn',
// //     to: 'yeuma99@gmail.com',
// //     subject: 'Sending Email using Node.js',
// //     text: 'That was easy!'
// // };

// transporter.verify(function(error, success) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Server is ready to take our messages');
//     }
// });
// // transporter.sendMail(mailOptions, function(error, info) {
// //     if (error) {
// //         console.log(error);
// //     } else {
// //         console.log('Email sent: ' + info.response);
// //     }
// // });



var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport')
const xoauth2 = require('xoauth2')
const account1 = {
    username: 'yeuma99@gmail.com',
    password: 'ccnnts99',
}
const account3 = {
    username: 'nguyenluc5699@gmail.com',
    password: 'ccnnts99',
}
const account2 = {
    username: 'lucnguyenvan@bigmax.vn',
    password: 'nguyenluc99'
}
var transporter = nodemailer.createTransport(smtpTransport({ //smtpTransport
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: true, //true for port  465, false for other ports
    ssl: true,
    port: 465,
    Authentication: 'AUTH PLAIN',
    tls: {
        rejectUnauthorized: false,
        // port: 587
    },
    auth: {
        user: account3.username,
        pass: account3.password,
        // type: xoauth2,
        // clientId: '114875371228995663709',
    },
}));

var mailOptions = {
    from: account3.username,
    to: account1.username,
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};
// transporter.verify(function(error, success) {
//     if (error) {
//         console.log(888888, error);
//     } else {
//         console.log(9000000, 'Server is ready to take our messages');
//     }
// });
transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});