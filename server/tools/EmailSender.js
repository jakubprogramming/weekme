const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'weekmeapp@gmail.com',
      pass: process.env.GMAILPASSWORD
    }
})


var sendResetPasswordMail = function(email, resetcode){

  var mailOptions = {
      from: 'weekme <weekmeapp@gmail.com>',
      to: email,
      subject: 'Password Reset Requested',
      text: `Please click this link within the next hour to reset your password:
             www.weekme.berlin/${resetcode} \n
             if you did not request a password change, please ignore this mail.`
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
