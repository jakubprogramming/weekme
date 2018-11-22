const mongoose = require('mongoose');

mongoose.Promise = global.Promise; //Tell mongoose to use the global Promise
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
module.exports = {mongoose};
