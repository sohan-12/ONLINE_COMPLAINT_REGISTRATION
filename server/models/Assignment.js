const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // The Agent's User ID
    },
    complaint_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
    },
    agent: {
      type: String,
      required: true, // Agent's name/identifier
    },
    status: {
      type: String,
      enum: ['Assigned', 'Active', 'Closed'],
      default: 'Assigned',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Assignment', AssignmentSchema);
