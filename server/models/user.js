const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require("lodash");
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }],
  reset: [{
    token: {
      type: String,
      required: false
    },
    validUntil: {
      type: String,
      required: false
    }
  }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ["_id", "email"]);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this; //we assign this to the user, to make clear where this is pointing to in that moment. From now on we will be working with the user object instead of using "this"
  var access = "auth";
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat([{access, token}]);

  //Return the success callback here so that we can use "then" in the location we call this method (generateAuthToken)
  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token){
  var user = this;

  return user.update({
    $pull: {   //$pull lets you remove Items from an array that match certain criteria
      tokens: {token} //ES6 (token: token)
    }
  })
};

UserSchema.methods.requestPasswordReset = function (){
  var user = this;

  return user.update({
    $set: {
      reset: {token: "asdasdas", validUntil: "123123123123"}
    }
  })
};

//UserSchma.statics --> adding a model method
UserSchema.statics.findByToken = function (token){
  var User = this;
  var decoded; //Will eventually store the _id of the user if the verifying process is successfull

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    "_id": decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

UserSchema.statics.findByCredentials = function (email, password){
  var User = this;

  return User.findOne({email}).then((user) => {
    if(!user){
        return Promise.reject();
    }

    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if(res) resolve(user);
          else reject();
        });
    });
  });
};

UserSchema.statics.findByEmail = function (email){
  var User = this;

  return User.findOne({email}).then((user) => {
    if(!user){
        return Promise.reject();
    } else {
      return Promise.resolve(user);
    }
  });
};

UserSchema.pre("save", function (next) {
  var user = this;
  if(user.isModified("password")){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model("User", UserSchema);

module.exports = {User};
