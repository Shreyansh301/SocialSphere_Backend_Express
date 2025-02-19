const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');

// Send a friend request
router.post('/api/friend-request', friendController.sendFriendRequest);

// Get pending friend requests
router.get('/api/friend-requests', friendController.getFriendRequests);

// Accept a friend request
router.post('/api/accept-friend-request', friendController.acceptFriendRequest);

// Reject a friend request
router.post('/api/reject-friend-request', friendController.rejectFriendRequest);

// Get friends
router.get('/api/friends', friendController.getFriends);

// Remove a friend
router.post('/api/remove-friend', friendController.removeFriend);

module.exports = router;