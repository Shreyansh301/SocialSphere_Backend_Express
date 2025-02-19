const User = require('../models/User');

// Send a friend request
const sendFriendRequest = async (req, res) => {
  const { sender, receiver } = req.body;

  if (!sender || !receiver) {
    return res.status(400).json({ error: "Sender and receiver are required" });
  }

  try {
    const receiverUser = await User.findOne({ username: receiver });
    if (!receiverUser) {
      return res.status(400).json({ error: "Receiver not found" });
    }

    await receiverUser.addFriendRequest(sender);
    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};

// Get pending friend requests
const getFriendRequests = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const friendRequests = await User.getFriendRequests(username);
    res.status(200).json(friendRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};

// Accept a friend request
const acceptFriendRequest = async (req, res) => {
  const { sender, receiver } = req.body;

  if (!sender || !receiver) {
    return res.status(400).json({ error: "Sender and receiver are required" });
  }

  try {
    const receiverUser = await User.findOne({ username: receiver });
    const senderUser = await User.findOne({ username: sender });

    if (!receiverUser || !senderUser) {
      return res.status(400).json({ error: "User not found" });
    }

    // Accept the friend request
    await receiverUser.acceptFriendRequest(sender);

    // Add the receiver to the sender's friends list
    if (!senderUser.friends.includes(receiver)) {
      senderUser.friends.push(receiver);
      await senderUser.save();
    }

    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};

// Reject a friend request
const rejectFriendRequest = async (req, res) => {
  const { sender, receiver } = req.body;

  if (!sender || !receiver) {
    return res.status(400).json({ error: "Sender and receiver are required" });
  }

  try {
    const receiverUser = await User.findOne({ username: receiver });

    if (!receiverUser) {
      return res.status(400).json({ error: "User not found" });
    }

    // Reject the friend request
    await receiverUser.rejectFriendRequest(sender);

    res.status(200).json({ message: "Friend request rejected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};

// Get friends
const getFriends = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const friends = await User.getFriends(username);
    res.status(200).json(friends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};

// Remove a friend
const removeFriend = async (req, res) => {
  const { username, friend } = req.body;

  if (!username || !friend) {
    return res.status(400).json({ error: "Username and friend are required" });
  }

  try {
    const user = await User.findOne({ username });
    const friendUser = await User.findOne({ username: friend });

    if (!user || !friendUser) {
      return res.status(400).json({ error: "User or friend not found" });
    }

    // Remove the friend from the user's friends list
    await user.removeFriend(friend);

    // Remove the user from the friend's friends list
    await friendUser.removeFriend(username);

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};

module.exports = {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  removeFriend,
};