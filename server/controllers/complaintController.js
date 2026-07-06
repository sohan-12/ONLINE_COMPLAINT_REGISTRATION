const Complaint = require('../models/Complaint');
const Assignment = require('../models/Assignment');
const User = require('../models/User');
const Message = require('../models/Message');

// ==========================================
// 👤 CITIZEN / USER CONTROLLER METHODS
// ==========================================

// @desc    Lodge a new complaint
// @route   POST /api/complaints
// @access  Private (User)
const lodgeComplaint = async (req, res, next) => {
  try {
    const { name, address, city, state, pincode, comment } = req.body;

    const complaint = await Complaint.create({
      name,
      address,
      city,
      state,
      pincode,
      comment,
      user: req.user.id,
      status: 'Pending',
    });

    res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints lodged by the logged-in citizen
// @route   GET /api/complaints/my
// @access  Private (User)
const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: complaints.length, data: complaints });
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
    const assignments = await Assignment.find({ user_id: req.user.id }).populate('complaint_id');
    
    // Extract and return the complaints
    const complaints = assignments
      .filter(assign => assign.complaint_id !== null)
      .map(assign => {
        // Attach the assignment ID and assignment status to the complaint object for front-end convenience
        const compObj = assign.complaint_id.toObject();
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
      .populate('user', 'name email ph_no')
      .sort({ createdAt: -1 });

    // Look up assignments for each complaint
    const complaintsWithAgents = await Promise.all(
      complaints.map(async (comp) => {
        const assignment = await Assignment.findOne({ complaint_id: comp._id }).populate('user_id', 'name email ph_no');
        const compObj = comp.toObject();
        if (assignment) {
          compObj.assignedAgent = {
            id: assignment.user_id ? assignment.user_id._id : null,
            name: assignment.agent,
            email: assignment.user_id ? assignment.user_id.email : '',
            ph_no: assignment.user_id ? assignment.user_id.ph_no : '',
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
    if (!agentUser || agentUser.user_type !== 'agent') {
      return res.status(400).json({ message: 'Selected user is not a valid Agent' });
    }

    // Check if already assigned
    let assignment = await Assignment.findOne({ complaint_id: complaintId });

    if (assignment) {
      // Re-assign
      assignment.user_id = agentUserId;
      assignment.agent = agentUser.name;
      assignment.status = 'Assigned';
      await assignment.save();
    } else {
      // Create new assignment
      assignment = await Assignment.create({
        user_id: agentUserId,
        complaint_id: complaintId,
        agent: agentUser.name,
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
    const agents = await User.find({ user_type: 'agent' }).sort({ createdAt: -1 });
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
    if (!agent || agent.user_type !== 'agent') {
      return res.status(404).json({ message: 'Agent not found' });
    }

    agent.is_approved = true;
    await agent.save();

    res.json({ success: true, message: 'Agent account approved successfully', data: agent });
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
    const complaint = await Complaint.findById(req.params.id).populate('user', 'name email ph_no');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Authorization checks:
    // Citizens can only view their own complaints
    if (req.user.user_type === 'user' && complaint.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    // Agents can only view complaints assigned to them
    if (req.user.user_type === 'agent') {
      const assignment = await Assignment.findOne({ complaint_id: complaint._id, user_id: req.user.id });
      if (!assignment) {
        return res.status(403).json({ message: 'Not authorized to view this complaint (not assigned to you)' });
      }
    }

    // Look up assignment information
    const assignment = await Assignment.findOne({ complaint_id: complaint._id }).populate('user_id', 'name email ph_no');
    const compObj = complaint.toObject();
    if (assignment) {
      compObj.assignment = {
        agentName: assignment.agent,
        agentPhone: assignment.user_id ? assignment.user_id.ph_no : '',
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
    if (req.user.user_type === 'agent') {
      const assignment = await Assignment.findOne({ complaint_id: complaint._id, user_id: req.user.id });
      if (!assignment) {
        return res.status(403).json({ message: 'Not authorized to update this complaint status' });
      }
    }

    // Allow Admins and assigned Agents to update
    if (req.user.user_type !== 'admin' && req.user.user_type !== 'agent') {
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    complaint.status = status;
    await complaint.save();

    // If status is Resolved or Rejected, close assignment if it exists
    if (status === 'Resolved' || status === 'Rejected') {
      const assignment = await Assignment.findOne({ complaint_id: complaint._id });
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

    if (req.user.user_type === 'user' && complaint.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (req.user.user_type === 'agent') {
      const assignment = await Assignment.findOne({ complaint_id: complaintId, user_id: req.user.id });
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
    if (req.user.user_type === 'user' && complaint.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (req.user.user_type === 'agent') {
      const assignment = await Assignment.findOne({ complaint_id: complaintId, user_id: req.user.id });
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
  getComplaintById,
  updateComplaintStatus,
  getChatMessages,
  sendChatMessage,
};
