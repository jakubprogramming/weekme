const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'weekmeapp@gmail.com',
      pass: process.env.GMAILPASSWORD
    }
})


var sendResetPasswordMail = function(email, resetcode, req){

  const url = req.protocol + '://' + req.get('host') + "/resetpassword/" + resetcode;

  // const url = "http://localhost:8080/reset-password.html?resetcode=" + resetcode;

  var mailOptions = {
      from: 'weekme <weekmeapp@gmail.com>',
      to: email,
      subject: 'Password Reset Requested',
      text: `Please click this link within the next hour to reset your password:
             ${url}
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
