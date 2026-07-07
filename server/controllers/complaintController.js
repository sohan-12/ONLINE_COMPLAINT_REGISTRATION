const Complaint = require('../models/Complaint');
const AssignedComplaint = require('../models/AssignedComplaint');
const User = require('../models/User');
const Message = require('../models/Message');

// ==========================================
// 👤 CITIZEN / USER CONTROLLER METHODS
// ==========================================

// @desc    Lodge a new complaint
// @route   POST /api/complaints
// @access  Private (Ordinary)
const lodgeComplaint = async (req, res, next) => {
  try {
    const { name, address, city, state, pincode, comment } = req.body;

    const complaint = await Complaint.create({
      name,
      address,
      city,
      state,
      pincode: Number(pincode),
      comment,
      userId: req.user.id,
      status: 'Pending',
    });

    res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
};

const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });

    // Look up assignments for each complaint
    const complaintsWithAgents = await Promise.all(
      complaints.map(async (comp) => {
        const assignment = await AssignedComplaint.findOne({ complaintId: comp._id }).populate('agentId', 'name email phone');
        const compObj = comp.toObject();
        if (assignment) {
          compObj.assignedAgent = {
            id: assignment.agentId ? assignment.agentId._id : null,
            name: assignment.agentName,
            email: assignment.agentId ? assignment.agentId.email : '',
            phone: assignment.agentId ? assignment.agentId.phone : '',
            assignmentStatus: assignment.status,
          };
        } else {
          compObj.assignedAgent = null;
        }
        return compObj;
      })
    );

    res.json({ success: true, count: complaintsWithAgents.length, data: complaintsWithAgents });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 🛠️ OFFICER / AGENT CONTROLLER METHODS
// ==========================================

// @desc    Get all complaints assigned to the logged-in agent
// @route   GET /api/complaints/assigned
// @access  Private (Agent)
const getAssignedComplaints = async (req, res, next) => {
  try {
    // Find all assignments for this agent
    const assignments = await AssignedComplaint.find({ agentId: req.user.id }).populate('complaintId');
    
    // Extract and return the complaints
    const complaints = assignments
      .filter(assign => assign.complaintId !== null)
      .map(assign => {
        // Attach the assignment ID and assignment status to the complaint object for front-end convenience
        const compObj = assign.complaintId.toObject();
        compObj.assignmentId = assign._id;
        compObj.assignmentStatus = assign.status;
        return compObj;
      });

    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 🔑 ADMIN CONTROLLER METHODS
// ==========================================

// @desc    Get all complaints system-wide
// @route   GET /api/complaints
// @access  Private (Admin)
const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    // Look up assignments for each complaint
    const complaintsWithAgents = await Promise.all(
      complaints.map(async (comp) => {
        const assignment = await AssignedComplaint.findOne({ complaintId: comp._id }).populate('agentId', 'name email phone');
        const compObj = comp.toObject();
        if (assignment) {
          compObj.assignedAgent = {
            id: assignment.agentId ? assignment.agentId._id : null,
            name: assignment.agentName,
            email: assignment.agentId ? assignment.agentId.email : '',
            phone: assignment.agentId ? assignment.agentId.phone : '',
            assignmentStatus: assignment.status,
          };
        } else {
          compObj.assignedAgent = null;
        }
        return compObj;
      })
    );

    res.json({ success: true, count: complaintsWithAgents.length, data: complaintsWithAgents });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign a complaint to an Agent/Officer
// @route   POST /api/complaints/:id/assign
// @access  Private (Admin)
const assignComplaint = async (req, res, next) => {
  try {
    const { agentUserId } = req.body; // The user ID of the agent
    const complaintId = req.params.id;

    // Verify complaint exists
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Verify agent exists
    const agentUser = await User.findById(agentUserId);
    if (!agentUser || agentUser.role !== 'Agent') {
      return res.status(400).json({ message: 'Selected user is not a valid Agent' });
    }

    // Check if already assigned
    let assignment = await AssignedComplaint.findOne({ complaintId: complaintId });

    if (assignment) {
      // Re-assign
      assignment.agentId = agentUserId;
      assignment.agentName = agentUser.name;
      assignment.status = 'Assigned';
      await assignment.save();
    } else {
      // Create new assignment
      assignment = await AssignedComplaint.create({
        agentId: agentUserId,
        complaintId: complaintId,
        agentName: agentUser.name,
        status: 'Assigned',
      });
    }

    // Update complaint status to In Progress
    complaint.status = 'In Progress';
    await complaint.save();

    res.json({ success: true, message: 'Complaint assigned successfully', assignment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all agents
// @route   GET /api/admin/agents
// @access  Private (Admin)
const getAllAgents = async (req, res, next) => {
  try {
    const agents = await User.find({ role: 'Agent' }).sort({ createdAt: -1 });
    res.json({ success: true, count: agents.length, data: agents });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Verify an agent account
// @route   PUT /api/admin/agents/:id/approve
// @access  Private (Admin)
const approveAgent = async (req, res, next) => {
  try {
    const agent = await User.findById(req.params.id);
    if (!agent || agent.role !== 'Agent') {
      return res.status(404).json({ message: 'Agent not found' });
    }

    agent.is_approved = true;
    await agent.save();

    res.json({ success: true, message: 'Agent account approved successfully', data: agent });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject/Delete a pending agent account
// @route   DELETE /api/complaints/admin/agents/:id/reject
// @access  Private (Admin)
const rejectAgent = async (req, res, next) => {
  try {
    const agent = await User.findById(req.params.id);
    if (!agent || agent.role !== 'Agent') {
      return res.status(404).json({ message: 'Agent not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Agent registration rejected and account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Ordinary citizens)
// @route   GET /api/complaints/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'Ordinary' }).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 🔄 SHARED CONTROLLER METHODS (Status, Detail, Chat)
// ==========================================

// @desc    Get a single complaint detail
// @route   GET /api/complaints/:id
// @access  Private (All authenticated roles)
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('userId', 'name email phone');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Authorization checks:
    // Citizens can only view their own complaints
    if (req.user.role === 'Ordinary' && complaint.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    // Agents can only view complaints assigned to them
    if (req.user.role === 'Agent') {
      const assignment = await AssignedComplaint.findOne({ complaintId: complaint._id, agentId: req.user.id });
      if (!assignment) {
        return res.status(403).json({ message: 'Not authorized to view this complaint (not assigned to you)' });
      }
    }

    // Look up assignment information
    const assignment = await AssignedComplaint.findOne({ complaintId: complaint._id }).populate('agentId', 'name email phone');
    const compObj = complaint.toObject();
    if (assignment) {
      compObj.assignment = {
        agentName: assignment.agentName,
        agentPhone: assignment.agentId ? assignment.agentId.phone : '',
        status: assignment.status,
      };
    } else {
      compObj.assignment = null;
    }

    res.json({ success: true, data: compObj });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Admin or Assigned Agent)
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Authorization checks:
    // If agent, verify they are assigned to this complaint
    if (req.user.role === 'Agent') {
      const assignment = await AssignedComplaint.findOne({ complaintId: complaint._id, agentId: req.user.id });
      if (!assignment) {
        return res.status(403).json({ message: 'Not authorized to update this complaint status' });
      }
    }

    // Allow Admins and assigned Agents to update
    if (req.user.role !== 'Admin' && req.user.role !== 'Agent') {
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    complaint.status = status;
    await complaint.save();

    // If status is Resolved or Rejected, close assignment if it exists
    if (status === 'Resolved' || status === 'Rejected') {
      const assignment = await AssignedComplaint.findOne({ complaintId: complaint._id });
      if (assignment) {
        assignment.status = 'Closed';
        await assignment.save();
      }
    }

    res.json({ success: true, message: 'Status updated successfully', data: complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Get support chat messages for a complaint
// @route   GET /api/complaints/:id/messages
// @access  Private (Citizen, Assigned Agent, Admin)
const getChatMessages = async (req, res, next) => {
  try {
    const complaintId = req.params.id;

    // Verify complaint details exist and user is authorized to read chat
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (req.user.role === 'Ordinary' && complaint.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (req.user.role === 'Agent') {
      const assignment = await AssignedComplaint.findOne({ complaintId: complaintId, agentId: req.user.id });
      if (!assignment) {
        return res.status(403).json({ message: 'Unauthorized (not assigned)' });
      }
    }

    const messages = await Message.find({ complaint_id: complaintId }).sort({ createdAt: 1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Post a support chat message
// @route   POST /api/complaints/:id/messages
// @access  Private (Citizen, Assigned Agent, Admin)
const sendChatMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check authorization to post
    if (req.user.role === 'Ordinary' && complaint.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (req.user.role === 'Agent') {
      const assignment = await AssignedComplaint.findOne({ complaintId: complaintId, agentId: req.user.id });
      if (!assignment) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    }

    const newMessage = await Message.create({
      message,
      complaint_id: complaintId,
      name: req.user.name,
    });

    // Handle Socket.io triggers for real-time notification
    const io = req.app.get('socketio');
    if (io) {
      io.to(complaintId.toString()).emit('receive_message', newMessage);
    }

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  lodgeComplaint,
  getMyComplaints,
  getAssignedComplaints,
  getAllComplaints,
  assignComplaint,
  getAllAgents,
  approveAgent,
  rejectAgent,
  getAllUsers,
  getComplaintById,
  updateComplaintStatus,
  getChatMessages,
  sendChatMessage,
};
