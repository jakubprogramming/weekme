var mongoose = require("mongoose");

var Task = mongoose.model("task", {
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 80,
    trim: true
  },
  dueAt: {
    type: Number,
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
  position: {
    type: Number,
    required: true,
    min: [0, 'Position may not be < 0'],
    max: [99, 'Position may not be > 9']
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
