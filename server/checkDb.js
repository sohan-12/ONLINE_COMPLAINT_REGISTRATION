const mongoose = require('mongoose');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const AssignedComplaint = require('./models/AssignedComplaint');
require('dotenv').config();

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    
    const userCount = await User.countDocuments();
    const complaintCount = await Complaint.countDocuments();
    const assignCount = await AssignedComplaint.countDocuments();

    console.log('=== DATABASE DIAGNOSTICS ===');
    console.log('Total Users:', userCount);
    console.log('Total Complaints:', complaintCount);
    console.log('Total Assignments:', assignCount);

    const complaints = await Complaint.find();
    console.log('\n--- Complaints in DB ---');
    complaints.forEach(c => {
      console.log(`- ID: ${c._id}, Name: ${c.name}, Status: ${c.status}, UserID: ${c.userId}`);
    });

    const assignments = await AssignedComplaint.find();
    console.log('\n--- Assignments in DB ---');
    assignments.forEach(a => {
      console.log(`- AgentName: ${a.agentName}, ComplaintID: ${a.complaintId}, Status: ${a.status}`);
    });

    mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
