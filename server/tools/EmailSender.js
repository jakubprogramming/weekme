// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var sendResetPasswordMail = function(email, resetcode, req){
  // const url = req.protocol + '://' + req.get('host') + "/resetpassword/" + resetcode;
  const url = "https://weekme.netlify.com/reset-password.html?resetcode=" + resetcode;

  const msg = {
    to: email,
    from: 'weekmeapp@gmail.com',
    subject: 'Password Reset Requested.js',
    html: `Please click this link within the next hour to reset your password:
           ${url}
           if you did not request a password change, please ignore this mail.`,
  };
  sgMail.send(msg);

module.exports = {
  sendResetPasswordMail
}
 
