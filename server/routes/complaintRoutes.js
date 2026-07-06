const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Citizens / Complainants
router.post('/', protect, authorize('user'), lodgeComplaint);
router.get('/my', protect, authorize('user'), getMyComplaints);

// Agents / Officers
router.get('/assigned', protect, authorize('agent'), getAssignedComplaints);

// Admins
router.get('/', protect, authorize('admin'), getAllComplaints);
router.post('/:id/assign', protect, authorize('admin'), assignComplaint);
router.get('/admin/agents', protect, authorize('admin'), getAllAgents);
router.put('/admin/agents/:id/approve', protect, authorize('admin'), approveAgent);

// Shared protected detail and chat routes
router.get('/:id', protect, getComplaintById);
router.put('/:id/status', protect, authorize('admin', 'agent'), updateComplaintStatus);
router.get('/:id/messages', protect, getChatMessages);
router.post('/:id/messages', protect, sendChatMessage);

module.exports = router;
