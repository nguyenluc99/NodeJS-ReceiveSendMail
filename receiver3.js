var inspect = require('util').inspect;
var fs = require('fs');
var base64 = require('base64-stream');
var Imap = require('imap');
var imaps = require('imap-simple')
var imap = new Imap({
    user: 'yeuma99@gmail.com',
    password: 'ccnnts99',
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    // debug: function(debug) { console.log('imap:', debug); }
});
var imaps = require('imap-simple');

var config = {
    imap: {
        user: 'yeuma99@gmail.com',
        password: 'ccnnts99',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        authTimeout: 10000
            // debug: function(debug) { console.log('imap:', debug); }
    }
};

function toUpper(thing) { return thing && thing.toUpperCase ? thing.toUpperCase() : thing; }

function findAttachmentParts(struct, attachments) {
    attachments = attachments || [];
    for (var i = 0, len = struct.length, r; i < len; ++i) {
        if (Array.isArray(struct[i])) {
            findAttachmentParts(struct[i], attachments);
        } else {
            if (struct[i].disposition && ['INLINE', 'ATTACHMENT'].indexOf(toUpper(struct[i].disposition.type)) > -1) {
                attachments.push(struct[i]);
            }
        }
    }
    return attachments;

}

function buildAttMessageFunction(attachment) {
    var filename = attachment.params.name;
    var encoding = attachment.encoding;

    return function(msg, seqno) {
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function(stream, info) {
            //Create a write stream so that we can stream the attachment to file;
            console.log(prefix + 'Streaming this attachment to file', filename, info);
            var writeStream = fs.createWriteStream(filename);
            writeStream.on('finish', function() {
                console.log(prefix + 'Done writing to file %s', filename);
            });

            //stream.pipe(writeStream); this would write base64 data to the file.
            //so we decode during streaming using 
            if (toUpper(encoding) === 'BASE64') {
                //the stream is base64 encoded, so here the stream is decode on the fly and piped to the write stream (file)
                stream.pipe(base64.decode()).pipe(writeStream);
            } else {
                //here we have none or some other decoding streamed directly to the file which renders it useless probably
                stream.pipe(writeStream);
            }
        });
        msg.once('end', function() {
            console.log(prefix + 'Finished attachment %s', filename);
        });
    };
}

// imap.once('ready', function() {
//     // console.log(6111)
//     imap.openBox('INBOX', true, function(err, box) {
//         if (err) throw err;
//         var f = imap.seq.fetch('1:1', {
//             bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'],
//             struct: true,
//             markSeen : false
//         });
//         // var g = imap.seq.fetch()
//         f.on('message', function(msg, seqno) {
//             console.log(69, msg)
//             console.log('Message #%d', seqno);
//             var prefix = '(#' + seqno + ') ';
//             msg.on('body', function(stream, info) {
//                 var buffer = '';
//                 stream.on('data', function(chunk) {
//                     buffer += chunk.toString('utf8');
//                 });
//                 stream.once('end', function() {
//                     console.log(prefix + 'Parsed header: %s', Imap.parseHeader(buffer));
//                 });
//             });
//             msg.once('attributes', function(attrs) {
//                 var attachments = findAttachmentParts(attrs.struct);
//                 console.log(prefix + 'Has attachments: %d', attachments.length);
//                 for (var i = 0, len = attachments.length; i < len; ++i) {
//                     var attachment = attachments[i];
//                     /*This is how each attachment looks like {
//                         partID: '2',
//                         type: 'application',
//                         subtype: 'octet-stream',
//                         params: { name: 'file-name.ext' },
//                         id: null,
//                         description: null,
//                         encoding: 'BASE64',
//                         size: 44952,
//                         md5: null,
//                         disposition: { type: 'ATTACHMENT', params: { filename: 'file-name.ext' } },
//                         language: null
//                       }
//                     */
//                     console.log(prefix + 'Fetching attachment %s', attachment.params.name);
//                     var f = imap.fetch(attrs.uid, { //do not use imap.seq.fetch here
//                         bodies: [attachment.partID],
//                         struct: true
//                     });
//                     //build function to process attachment message
//                     f.on('message', buildAttMessageFunction(attachment));
//                 }
//             });
//             msg.once('end', function() {
//                 console.log(prefix + 'Finished email');
//             });
//         });
//         f.once('error', function(err) {
//             console.log('Fetch error: ' + err);
//         });
//         f.once('end', function() {
//             console.log('Done fetching all messages!');
//             imap.end();
//         });
//     });
// });

imap.once('error', function(err) {
    console.log(err);
});

imap.once('end', function() {
    console.log('Connection ended');
});

const pdf = require('pdf-parse')
const pdfDownload = require('node-gmail-api')
const base64file = require('file-base64')
imaps.connect(config).then(function(connection) {
    connection.openBox('INBOX').then(function() {
        let delay = 24 * 3600 * 1000;
        var yesterdayy = new Date();
        yesterdayy.setTime(Date.now() - delay);
        yesterdayy = yesterdayy.toISOString();
        var searchCriteria = ['UNSEEN', ['SINCE', yesterdayy]];
        var fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false,
            struct: true
        };

        // retrieve only the headers of the messages
        return connection.search(searchCriteria, fetchOptions);
    }).then(function(messages) {

        var attachments = [];

        // ------Loading pdf file from gmail api to storage

        console.log(messages.length)
        var message_raw = messages[messages.length - 1].parts[0].body // 4 => oke
            // console.log(message_raw)
        let msg = message_raw.split('\r\n\r\n')
            // console.log(msg[msg.length - 1])
        console.log(msg)

        // if (!msg[6]) return console.log("no attachment")
        let data = '\r\n' + msg[msg.length - 1]
            // console.log(data)
        base64file.decode(data, './files/data.pdf', (error, output) => {
            console.log(183, error, output)
        })

        // ----------------------------





        // console.log(179, messages[messages.length - 3])
        // console.log(179, messages[messages.length - 4])
        // if (!message_raw) console.log("no message")
        // let body = message_raw[0].body
        //     // console.log(179, messages[messages.length - 3])
        // if (!body) console.log("no attachment")
        // console.log(body)


        // let msg = (message_raw.split('--000000000000f2d')[2].split('\r\n\r\n')[1])
        // let data = '\r\n' + msg
        // base64file.decode(data, './files/msg2.pdf', (error, output) => {
        //         console.log(19, error, output)
        //     })


        // let jsonStr = JSON.parse(message_raw, (error, result) => {
        //     console.log(error, result)
        // })
        // console.log(jsonStr)
        // let buf = Buffer.from(msg, 'base64')
        // console.log(185, msg)
        // let str
        // base64file.encode('./files/abc.txt', function(err, base64String) {
        //     console.log(1877, err)
        //     console.log(187, base64String);
        //     // fs.writeFileSync('./files/abcEncoded.txt', base64String)
        //     fs.writeFile('./files/abcEncoded.txt', base64String, (error) => {
        //         console.log(error)
        //         base64file.decode('./files/abcEncoded.txt', './files/abcDecoded.txt', function(error, output) {
        //             console.log(193, error, output)
        //         })
        //     })
        // });


        // fs.writeFile('./files/readingFile1.txt', buf, 'utf8', error => {
        //     console.log(187, error)
        // });
        // pdf(message_raw).then(data => {
        //         // if (error) return console.log(177, error)
        //         console.log(178, data)
        //     }).catch(error => {
        //         console.log(180, error)
        //     })
        // message = messages[messages.length - 4]
        // console.log(message)
        // messages.forEach(function(message) {
        // let message_raw = message.parts[0].body
        //     // let buff = new Buffer(message_raw, 'binary')
        // let buff = Buffer.from(message_raw, 'utf-8').toString()
        // let text = buff.toString()
        // console.log(174, Buffer.from(message_raw, 'utf-8').toString())
        // console.log(16888, message.parts[0].body)
        // var parts = imaps.getParts(message);
        // var parts = message.parts
        // console.log(168, parts)
        // attachments = attachments.concat(parts.filter(function(part) {
        //     // console.log(1711, part)
        //     return part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT';
        // }).map(function(part) {
        //     // retrieve the attachments only of the messages with attachments
        //     return connection.getPartData(message, part)
        //         .then(function(partData) {
        //             // console.log(1777, partData)
        //             return {
        //                 filename: part.disposition.params.filename,
        //                 data: partData
        //             };
        //         });
        // }));
        // });
        // return Promise.all(attachments);
        // }).then(function(attachments) {
        //     // console.log("end")
        //     console.log(184, attachments, 184444);
        //     // =>
        //     //    [ { filename: 'cats.jpg', data: Buffer() },
        //     //      { filename: 'pay-stub.pdf', data: Buffer() } ]
        return
    });
})