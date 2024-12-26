import Post from "../models/post.model.js";
import User from "../models/user.model.js";

// Fetch all users with pagination and sorting
export const getUsers = async (req, res) => {
  // Set default values for pagination and sorting
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 8; // Fix the limit variable
  const sortDirection = req.query.order === "asc" ? 1 : -1;

  try {
    // Fetch users from the database with pagination and sorting
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .limit(limit)
      .skip(startIndex);

    // Total count of users for pagination
    const totalUsers = await User.countDocuments();

    // Respond with users and total user count
    res.status(200).json({ users, totalUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch all posts
export const getPosts = async (req, res, next) => {
  const startIndex = req.query.startIndex || 0;
  const limit = req.query.limit || 8;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  const now = new Date();

  try {
    const queryFilters = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchInput && {
        $or: [
          { title: { $regex: req.query.searchInput, $options: "i" } },
          { category: { $regex: req.query.searchInput, $options: "i" } },
          { content: { $regex: req.query.searchInput, $options: "i" } },
        ],
      }),
    };

    const posts = await Post.find(queryFilters)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Total posts
    const totalPosts = await Post.countDocuments(queryFilters);

    // One month ago posts
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  const { userId } = req.params; // Get userId from request parameters

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a post (to be implemented)
export const deletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost)
      return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: "Post deleted successfully", deletedPost });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const makeOrRemoveAdmin = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isAdmin = user.isAdmin;
    const newAdminStatus = !isAdmin;
    user.isAdmin = newAdminStatus;
    await user.save();
    res.status(200).json({ message: "Admin status updated" });
  } catch (error) {
    console.error("Error updating admin status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
