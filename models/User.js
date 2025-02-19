//User schema and model
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  friendRequests: [{
    type: String, // Store usernames of users who sent friend requests
  }],
  friends: [{
    type: String, // Store usernames of friends
  }],
}, { timestamps: true });

// Hashing the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Comparing password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add a friend request
userSchema.methods.addFriendRequest = async function (senderUsername) {
  if (!this.friendRequests.includes(senderUsername)) {
    this.friendRequests.push(senderUsername);
    await this.save();
  }
};

// Accept a friend request
userSchema.methods.acceptFriendRequest = async function (senderUsername) {
  // Remove the request from the receiver's pending requests
  this.friendRequests = this.friendRequests.filter(
    (req) => req !== senderUsername
  );

  // Add the sender to the receiver's friends list
  if (!this.friends.includes(senderUsername)) {
    this.friends.push(senderUsername);
  }

  await this.save();
};

// Reject a friend request
userSchema.methods.rejectFriendRequest = async function (senderUsername) {
  // Remove the request from the receiver's pending requests
  this.friendRequests = this.friendRequests.filter(
    (req) => req !== senderUsername
  );

  await this.save();
};

// Remove a friend
userSchema.methods.removeFriend = async function (friendUsername) {
  // Remove the friend from the user's friends list
  this.friends = this.friends.filter((f) => f !== friendUsername);
  await this.save();
};

// Get friend requests with user details
userSchema.statics.getFriendRequests = async function (username) {
  const user = await this.findOne({ username });
  if (!user) {
    throw new Error('User not found');
  }
  return this.find(
    { username: { $in: user.friendRequests } },
    { username: 1, email: 1, profilePicture: 1 }
  );
};

// Get friends with user details
userSchema.statics.getFriends = async function (username) {
  const user = await this.findOne({ username });
  if (!user) {
    throw new Error('User not found');
  }
  return this.find(
    { username: { $in: user.friends } },
    { username: 1, email: 1 }
  );
};

module.exports = mongoose.model('User', userSchema);