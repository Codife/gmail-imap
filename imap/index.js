const Imap = require('imap');
const emailParser = require('mailparser').simpleParser;

const ImapFunc = (res) => {
    const imap = new Imap({
        user: 'anohun928@gmail.com',
        password: 'iuzhrnmdaamflvrc',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: {
            rejectUnauthorized: false
        }
    });

    const emails = []; // Array to store email data

    function openInbox(cb) {
        imap.openBox('INBOX', false, cb);
    }

    imap.once('ready', function () {
        openInbox(function (err, box) {
            if (err) throw err;
            imap.search(['UNSEEN'], function (err, results) {
                if (err) throw err;
                var f = imap.fetch(results, { bodies: '' });
                f.on('message', function (msg, seqno) {
                    console.log('Message #%d', seqno);
                    var prefix = '(#' + seqno + ') ';

                    let emailData = {
                        seqno: seqno,
                        from: null,
                        to: null,
                        cc: null,
                        bcc: null,
                        subject: null,
                        text: null,
                        html: null,
                        attachments: []
                    };

                    msg.on('body', function (stream, info) {
                        let data = '';
                        stream.on('data', function (chunk) {
                            data += chunk.toString('utf8');
                        });

                        stream.on('end', function () {
                            // Parse the email using mailparser
                            emailParser(data, {}, (err, parsedEmail) => {
                                if (err) throw err;

                                emailData.from = parsedEmail.from;
                                emailData.to = parsedEmail.to;
                                emailData.cc = parsedEmail.cc;
                                emailData.bcc = parsedEmail.bcc;
                                emailData.subject = parsedEmail.subject;
                                emailData.text = parsedEmail.text.replace(/\n+/g, ' ');
                                emailData.html = parsedEmail.html.replace(/\n+/g, ' ');
                                emailData.attachments = parsedEmail.attachments;

                                emails.push(emailData);
                            });
                        });
                    });
                });

                f.once('error', function (err) {
                    console.log('Fetch error: ' + err);
                });

                f.once('end', function () {
                    console.log('Done fetching all messages!');
                    imap.end();

                    // Send the emails array as a response
                    res.send(emails);
                });
            });
        });
    });


    imap.once('error', function (err) {
        console.log(err);
    });

    imap.once('end', function () {
        console.log('Connection ended');
    });

    imap.connect();
}

module.exports = ImapFunc;
