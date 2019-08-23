const nodemailer = require('nodemailer')
const xoauth2 = require('xoauth2')

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    // host: 'lucnguyenvan@bigmax.vn',
    secure: false,
    // port: 465,
    auth: {
        // type: xoauth2, //Authentication type
        type: 'OAuth2',
        user: 'lucnguyenvan@bigmax.vn', //For example, xyz@gmail.com
        pass: 'nguyenluc99',
        clientId: '114875371228995663709',
        clientSecret: 'mEax79CGqUVtEis9bxBETSkT',
    },
    // Authentication: 'AUTH PLAIN',
    tls: {
        rejectUnauthorized: false
    }
})
let mailOptions = {
    // from: ‘your_email@service.com’,
    from: 'lucnguyenvan@bigmax.vn',
    to: 'yeuma99@gmail.com',
    subject: 'test sending mail using nodejs',
    text: 'helloooo',
};
sendGmail = async function() {
    let a = await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (e, r) => {
            if (e) {
                console.log(e)
                reject(e)
            } else {
                console.log(r)
                resolve(r)
            }
            transporter.close()
        })
    })
    return console.log(a)
}
sendGmail()