const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const AssignedComplaint = require('./models/AssignedComplaint');
require('dotenv').config();

const seedMockData = async () => {
  try {
    const mongoUri = process.env.MONGO_DB;
    if (!mongoUri) {
      console.error('MONGO_DB environment variable is missing in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas to seed mock data...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing mock data (optional, but keeps database clean)
    console.log('Cleaning up existing mock data...');
    await User.deleteMany({ email: { $in: [
      'aarav@gmail.com', 'priya@gmail.com', 'devendra@gmail.com',
      'rajesh@gmail.com', 'sneha@gmail.com', 'vikram@gmail.com'
    ] } });
    
    // We do not delete the main admin account
    
    // Create Citizens
    console.log('Seeding Citizens...');
    const citizenPassword = await bcrypt.hash('password123', 10);
    const aarav = await User.create({
      name: 'Aarav Patel',
      email: 'aarav@gmail.com',
      password: citizenPassword,
      phone: 9876543210,
      role: 'Ordinary'
    });
    const priya = await User.create({
      name: 'Priya Sharma',
      email: 'priya@gmail.com',
      password: citizenPassword,
      phone: 8765432109,
      role: 'Ordinary'
    });
    const devendra = await User.create({
      name: 'Devendra Iyer',
      email: 'devendra@gmail.com',
      password: citizenPassword,
      phone: 7654321098,
      role: 'Ordinary'
    });

    // Create Agents
    console.log('Seeding Agents...');
    const agentPassword = await bcrypt.hash('password123', 10);
    const rajesh = await User.create({
      name: 'Rajesh Verma',
      email: 'rajesh@gmail.com',
      password: agentPassword,
      phone: 9123456789,
      role: 'Agent',
      is_approved: true // Pre-approved agent
    });
    const sneha = await User.create({
      name: 'Sneha Reddy',
      email: 'sneha@gmail.com',
      password: agentPassword,
      phone: 9234567890,
      role: 'Agent',
      is_approved: true // Pre-approved agent
    });
    const vikram = await User.create({
      name: 'Vikram Malhotra',
      email: 'vikram@gmail.com',
      password: agentPassword,
      phone: 9345678901,
      role: 'Agent',
      is_approved: false // Pending approval agent
    });

    // Create Complaints
    console.log('Seeding Complaints...');
    
    // Complaint 1 - Aarav (Mumbai) - Pending
    const comp1 = await Complaint.create({
      name: 'Aarav Patel',
      address: 'B-402, Shanti Nagar, Link Road, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: 400053,
      comment: 'Major water pipeline leakage near the main entrance. Thousands of gallons of clean drinking water is being wasted since yesterday morning. The local municipality helpline is unresponsive.',
      userId: aarav._id,
      status: 'Pending'
    });

    // Complaint 2 - Priya (Bangalore) - In Progress (Assigned to Rajesh)
    const comp2 = await Complaint.create({
      name: 'Priya Sharma',
      address: 'Flat 12A, Sobha Lavender Apartments, HSR Layout Sector 3',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: 560102,
      comment: 'Frequent and unannounced power cuts occur daily for 3-4 hours. It is highly disruptive for work-from-home professionals and students. High voltage fluctuations are also damaging household appliances.',
      userId: priya._id,
      status: 'In Progress'
    });

    // Complaint 3 - Devendra (Delhi) - In Progress (Assigned to Sneha)
    const comp3 = await Complaint.create({
      name: 'Devendra Iyer',
      address: 'House 55, Block C, Vasant Kunj',
      city: 'Delhi',
      state: 'Delhi',
      pincode: 110070,
      comment: 'Piles of municipal waste and plastic bags are accumulating near our local community park. The municipal garbage collection truck has not visited this block in over 6 days. Stray animals are scattering the waste on the main road.',
      userId: devendra._id,
      status: 'In Progress'
    });

    // Complaint 4 - Aarav (Pune) - Resolved
    const comp4 = await Complaint.create({
      name: 'Aarav Patel',
      address: 'Sector 5, Karve Road, Kothrud',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: 411038,
      comment: 'Five consecutive street lights are completely broken and dark on our lane. It makes the street unsafe for elderly citizens and children walking after 7 PM.',
      userId: aarav._id,
      status: 'Resolved'
    });

    // Seed Assignments
    console.log('Seeding Assignments...');
    
    // Assign Comp 2 to Rajesh
    await AssignedComplaint.create({
      agentId: rajesh._id,
      complaintId: comp2._id,
      status: 'Assigned',
      agentName: rajesh.name,
      agentPhone: rajesh.phone
    });

    // Assign Comp 3 to Sneha
    await AssignedComplaint.create({
      agentId: sneha._id,
      complaintId: comp3._id,
      status: 'Assigned',
      agentName: sneha.name,
      agentPhone: sneha.phone
    });

    // Assign Comp 4 to Rajesh (and it is resolved)
    await AssignedComplaint.create({
      agentId: rajesh._id,
      complaintId: comp4._id,
      status: 'Closed',
      agentName: rajesh.name,
      agentPhone: rajesh.phone
    });

    console.log('Mock database seeding completed successfully!');
    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding mock database:', error);
    process.exit(1);
  }
};

seedMockData();
