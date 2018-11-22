require("./config/config.js");

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const {ObjectID} = require("mongodb");

var {mongoose} = require("./db/mongoose");
var {Task} = require("./models/task");
var {User} = require("./models/user");
var {authenticate} = require("./middleware/authenticate");

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(helmet());

//TODO DO NOT ALLOW CROSS ORIGIN IN PRODUCTION
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, x-auth, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", 'DELETE, PUT, GET, POST');
  res.header("Access-Control-Expose-Headers",  "x-auth");
  next();
});

app.post("/tasks", authenticate, (req, res) => {

  var task = new Task({
    content: req.body.content,
    frame: req.body.frame,
    _user: req.user._id, //We have acces to the user because of our middleware function authenticate
    reoccuring: req.body.reoccuring,
    dueAt: req.body.dueAt,
    color: req.body.color
  });

  task.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })

});

app.get("/tasks", authenticate, (req, res) => {
  Task.find({
    _user: req.user._id // Only return tasks of logged user (user reference comming from middleware function authenticate)
  }).then((tasks) => {
    res.send({
      tasks
    });
  }, (e) => {
    res.send(400).send(e);
  });
});

app.get("/opentasks", authenticate, (req, res) => {
  Task.find({
    _user: req.user._id,
    done: false
  }).then((tasks) => {
    res.send({
      tasks
    });
  }, (e) => {
    res.send(400).send(e);
  });
});

app.get("/tasks/:id", authenticate, (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    res.status(404).send();
  }

  Task.findOne({
    _id: id,
    _user: req.user._id
  }).then((task) => {
    if(!task){
      return res.status(404).send();
    }
    res.send({task});
  }, (e) => {
    res.status(400).send();
  });
});

app.delete("/tasks/:id", authenticate, async(req, res) => {

  try{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }

    const task = await Task.findOneAndRemove({
      _id: id,
      _user: req.user._id
    });

    if(!task){
      return res.status(404).send();
    }

    res.send({task});

  } catch(e) {
    res.status(400).send();
  }
});

app.patch("/tasks/:id", authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ["content", "dueAt", "reoccuring", "done", "frame", "color"]);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.done) && body.done){
    body.doneAt = new Date().getTime();
  } else {
    body.done = false;
    body.doneAt = null;
  }

  Task.findOneAndUpdate({_id: id, _user: req.user._id}, {$set: body}, {new: true, runValidators: true}).then((task) => {

    if(!task){
      res.status(404).send();
    }
    res.send({task});

  }).catch((e) => {
    res.status(400).send({error: e});
  });

})

app.post("/users", async (req, res) => {

try {
  var body = _.pick(req.body, ["email", "password"]);
  var user = new User(body);
  await user.save();
  const token = await user.generateAuthToken();
  res.header("x-auth", token).send(user);

} catch(e) {
  res.status(400).send(e);
}

});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

app.post("/users/login", async (req, res) => {
  try {
    const body = _.pick(req.body, ["email", "password"]);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header("x-auth", token).send(user); //res.header lets us set a header
  } catch(e) {
    res.status(400).send();
  }
});

app.delete("/users/me/token", authenticate, async (req, res) => {
  try{
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log("Started server on port ", port);
});


//Task Manager


module.exports = {app};
