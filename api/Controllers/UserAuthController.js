const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/User");
require("dotenv").config();

const userAuthController = async (req, res) => {
  const { email, pass } = req.body;

  // Check if email and password are provided
  if (!email || !pass) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ where: { user_email: email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Validate password
    const validPass = await bcrypt.compare(pass, user.user_pass);
    if (!validPass) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token with user role
    const token = jwt.sign(
      { id: user.user_id, email: user.user_email, role: user.user_role }, // Include user_role
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond with token and user details
    return res.status(200).json( { token, user } );
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = userAuthController;

