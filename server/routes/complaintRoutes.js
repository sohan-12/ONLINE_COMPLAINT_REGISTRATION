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
  rejectAgent,
  getAllUsers,
  getComplaintById,
  updateComplaintStatus,
  getChatMessages,
  sendChatMessage,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Citizens / Complainants (Ordinary users)
router.post('/', protect, authorize('Ordinary'), lodgeComplaint);
router.get('/my', protect, authorize('Ordinary'), getMyComplaints);

// Agents / Officers (Agent users)
router.get('/assigned', protect, authorize('Agent'), getAssignedComplaints);

// Admins (Admin users)
router.get('/', protect, authorize('Admin'), getAllComplaints);
router.post('/:id/assign', protect, authorize('Admin'), assignComplaint);
router.get('/admin/agents', protect, authorize('Admin'), getAllAgents);
router.put('/admin/agents/:id/approve', protect, authorize('Admin'), approveAgent);
router.delete('/admin/agents/:id/reject', protect, authorize('Admin'), rejectAgent);
router.get('/admin/users', protect, authorize('Admin'), getAllUsers);

// Shared protected detail and chat routes (All logged-in roles)
router.get('/:id', protect, getComplaintById);
router.put('/:id/status', protect, authorize('Admin', 'Agent'), updateComplaintStatus);
router.get('/:id/messages', protect, getChatMessages);
router.post('/:id/messages', protect, sendChatMessage);

module.exports = router;
