const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Message content cannot be empty'],
      trim: true,
    },
    complaint_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
    },
    name: {
      type: String,
      required: true, // Sender's name
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', MessageSchema);
