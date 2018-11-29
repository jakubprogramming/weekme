const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'weekmeapp@gmail.com',

    }
})


var sendResetPasswordMail = function(recipient){

  var mailOptions = {
      from: 'weekme <weekmeapp@gmail.com>',
      to: recipient,
      subject: 'Password Reset Requested',
      text: 'Please suck my noodle'
  }

  transporter.sendMail(mailOptions, function (err, res) {
      if(err){
          console.log('Error', err);
      } else {
          console.log('Email Sent to ' + recipient);
      }
  })
}

module.exports = {
  sendResetPasswordMail
}
