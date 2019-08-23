// // const nodemailer = require('nodemailer');
// // const smtpTransport = require('nodemailer-smtp-transport')
// // const xoauth2 = require('xoauth2')
// // const Imap = require('imap')
// // const inspect = require('util').inspect

// // const account1 = {
// //     username: 'yeuma99@gmail.com',
// //     password: 'ccnnts99',
// // }
// // const account2 = {
// //     username: 'nguyenluc5699@gmail.com',
// //     password: 'ccnnts99'
// // }
// // const account3 = {
// //     username: 'lucnguyenvan@bigmax.vn',
// //     password: 'nguyenluc99'
// // }

// // var imap = new Imap({
// //     service: 'gmail',
// //     host: 'pop.gmail.com',
// //     port: 995,
// //     secure: false,
// //     tls: {
// //         rejectUnauthorized: false,
// //     },
// //     // tls: true,
// //     // ssl: true,
// //     debug: (debug) => console.log("debug  ", debug),
// //     auth: {
// //         user: account1.username,
// //         password: account1.password,
// //         type: xoauth2,
// //     },
// //     Authentication: 'AUTH PLAIN',
// //     authTimeout: 10000
// // });

// // function openInbox(cb) {
// //     imap.openBox('INBOX', true, cb);
// // }

// // // imap.once('ready', function() {
// // //     console.log(4444)
// // //     openInbox(function(err, box) {
// // //         if (err) throw err;
// // //         console.log(3666)
// // //         var f = imap.seq.fetch('1:1', {
// // //             bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
// // //             struct: true
// // //         });
// // //         f.on('message', function(msg, seqno) {
// // //             console.log(40000000, 'Message #%d', seqno);
// // //             var prefix = '(#' + seqno + ') ';
// // //             msg.on('body', function(stream, info) {
// // //                 var buffer = '';
// // //                 stream.on('data', function(chunk) {
// // //                     buffer += chunk.toString('utf8');
// // //                 });
// // //                 stream.once('end', function() {
// // //                     console.log(4888888, prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
// // //                 });
// // //             });
// // //             msg.once('attributes', function(attrs) {
// // //                 console.log(5222222, prefix + 'Attributes: %s', inspect(attrs, false, 8));
// // //             });
// // //             msg.once('end', function() {
// // //                 console.log(5555555555, prefix + 'Finished');
// // //             });
// // //         });
// // //         f.once('error', function(err) {
// // //             console.log(59999999, 'Fetch error: ' + err);
// // //         });
// // //         f.once('end', function() {
// // //             console.log(622222222, 'Done fetching all messages!');
// // //             imap.end();
// // //         });
// // //     });
// // // });

// // imap.once('ready', function(err) {

// //     console.log(8333)
// //     if (err) console.log(8444, err)
// // })

// // imap.once('error', function(err) {
// //     console.log(6999999999, err);
// //     console.log(70000000, imap.state)
// // });

// // imap.once('end', function() {
// //     console.log(733333333, 'Connection ended');
// // });
// // // console.log(87)
// // imap.connect();



var fs = require('fs');
var readline = require('readline');
var { google } = require('googleapis');

// If modifying these scopes, delete your previously saved credentials
// at TOKEN_DIR/gmail-nodejs.json
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

// Change token directory to your system preference
var TOKEN_DIR = __dirname;
var TOKEN_PATH = TOKEN_DIR + '\\gmail-nodejs.json';
console.log(112, TOKEN_PATH)

var gmail = google.gmail('v1');

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log(119, 'Error loading client secret file: ' + err);
        return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Gmail API.
    authorize(JSON.parse(content), listLabels({
        user: "yeuma99@gmail.com",
        pass: "ccnnts99",
    }));
});

// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  *
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
function authorize(credentials, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];

    var OAuth2 = google.auth.OAuth2;

    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
}

// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  *
//  * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback to call with the authorized
//  *     client.
//  */
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
    console.log(164)
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the code from that page here: ', function(code) {
        console.log(172, code)
            // oauth2Client.getToken()
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log(176)
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
        rl.close();
    });
}

// /**
//  * Store token to disk be used in later program executions.
//  *
//  * @param {Object} token The token to store to disk.
//  */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            console.log(200, err);
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log(198, 'Token stored to ' + TOKEN_PATH);
}

// /**
//  * Lists the labels in the user's account.
//  *
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
function listLabels(auth) {
    gmail.users.labels.list({ auth: auth, userId: 'me', }, function(err, response) {
        if (err) {
            console.log(209, 'The API returned an error: ' + err);
            return;
        }

        var labels = response.data.labels;

        if (labels.length == 0) {
            console.log(216, 'No labels found.');
        } else {
            console.log(218, 'Labels:');
            for (var i = 0; i < labels.length; i++) {
                var label = labels[i];
                console.log(221, '%s', label.name);
            }
        }
    });
}

// const inbox = require('inbox')
// const port = 993 //defaults to 143 on non-secure and to 993 on secure connection
// const xoauth2 = require('xoauth2')
// const host = "imap.gmail.com"
// const account1 = {
//     username: 'yeuma99@gmail.com',
//     password: 'ccnnts99',
// }
// let client = inbox.createConnection(port, host, {
//     secureConnection: true,
//     auth: {
//         XOAuth2: xoauth2,
//         user: account1.username,
//         pass: account1.password,
//     },

// })
// client.listMailboxes(function(error, mailboxes) {
//     // for (var i = 0, len = mailboxes.length; i < len; i++) {
//     //     if (mailboxes[i].hasChildren) {
//     //         mailboxes[i].listChildren(function(error, children) {
//     //             console.log(children);
//     //         });
//     //     }
//     // }
//     console.log(260, error, mailboxes)
// });
// client.on("connect", function() {
//     console.log("Successfully connected to server");
// })
// client.connect()
//     // client.close()
// client.on('close', function() {
//     console.log('DISCONNECTED!');
// });