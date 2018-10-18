var mongoose = require("mongoose");

var Task = mongoose.model("task", {
  content: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  day: {
    type: Number,
    default: null,
    min: [0, 'Day may not be < 0'],
    max: [6, 'Day may not be > 6']
  },
  done: {
    type: Boolean,
    default: false
  },
  doneAt: {
    type: Number,
    default: null
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Task};
