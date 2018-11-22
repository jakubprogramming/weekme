var mongoose = require("mongoose");

var Task = mongoose.model("task", {
  content: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  dueAt: {
    type: Date,
    default: null
  },
  reoccuring: {
    type: Boolean,
    default: false
  },  
  done: {
    type: Boolean,
    default: false
  },
  doneAt: {
    type: Number,
    default: null
  },
  frame: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 6,
    trim: true
  },
  color: {
    type: Number,
    default: 0,
    min: [0, 'Color may not be < 0'],
    max: [15, 'Color may not be > 15']
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Task};
