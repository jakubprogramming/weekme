const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'weekmeapp@gmail.com',
      pass: process.env.GMAILPASSWORD
    }
})


var sendResetPasswordMail = function(user){

  var mailOptions = {
      from: 'weekme <weekmeapp@gmail.com>',
      to: user.email,
      subject: 'Password Reset Requested',
      text: `Please click this link to reset your password:
             www.weekme.berlin/${user._id} \n
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
