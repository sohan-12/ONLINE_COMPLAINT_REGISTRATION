const mongoose = require("mongoose");

const assignedcomplaintsSchema = mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  complaintId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Complaint" },
  status: { type: String, required: true },
  agentName: { type: String, required: true },
});

module.exports = mongoose.model("AssignedComplaint", assignedcomplaintsSchema);
