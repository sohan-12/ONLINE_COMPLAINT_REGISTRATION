const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add the complainant name'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please add the address'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please add the city'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please add the state'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Please add the pincode'],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment describing the issue'],
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', ComplaintSchema);
