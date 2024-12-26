import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You are not authorized to get users" });
  }

  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.sort === "asc" ? 1 : -1;

  try {
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Remove password from each user object
    const usersWithoutPassword = users.map(
      ({ _doc: { password, ...rest } }) => rest
    );

    const totalUsers = await User.countDocuments();

    // Get date one month ago
    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res
      .status(200)
      .json({ users: usersWithoutPassword, totalUsers, lastMonthUsers });
  } catch (error) {
    console.log("Error in getting users:", error);
    res.status(500).json({ message: "Error in getting users" });
  }
};

export const updateUser = async (req, res) => {
  if (req.user.id !== req.params.userId) {
    res.status(403).json({ message: "You are not authorized" });
  }
  const { fullname, username, email, profilePicture } = req.body;

  // Check if the email or username is already taken by another user
  const userExist = await User.findOne({
    $or: [{ username }, { email }],
    _id: { $ne: req.user.id }, // Exclude the current user from the check
  });

  if (userExist) {
    return res
      .status(400)
      .json({ message: "Username or email is already taken" });
  }

  if (!fullname || !email || !username)
    return res.status(400).json({ message: "All fields are required" });

  if (req.body.username) {
    if (req.body.username.length < 4 || req.body.username.length > 20) {
      return res
        .status(400)
        .json({ message: "Username must be between 4 and 20 characters" });
    }
    if (req.body.username.includes(" ")) {
      return res
        .status(400)
        .json({ message: "Username cannot contain spaces" });
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return res.status(400).json({ message: "Username must be lowercase" });
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return res
        .status(400)
        .json({ message: "Username can only contain letters and numbers" });
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          fullname: req.body.fullname,
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.error("Error in Update controller", error.message);
    res.status(500).json({ message: "Failed to Update profile" });
  }
};

export const deleteUser = async (req, res) => {
  if (req.user.id !== req.params.userId)
    return res
      .status(403)
      .json({ message: "You are not authorized to do this action." });

  try {
    const userToDelete = await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log("Error in deleting user: ", error.message);
    res.status(500).json({ message: "Error in deleting account" });
  }
};
