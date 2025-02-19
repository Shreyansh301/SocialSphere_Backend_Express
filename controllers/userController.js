const User = require('../models/User');

const getAllUsers = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const users = await User.find({ username: { $ne: username } }, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};

module.exports = { getAllUsers };