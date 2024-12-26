import jwt from "jsonwebtoken";

const VerifyAdminToken = async (req, res, next) => {
  const token = req.cookies.access_token; // Get token from cookies

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(401)
        .clearCookie("access_token")
        .json({ message: "Unauthorized: Invalid token" });
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    req.user = user; // Attach user information to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

export default VerifyAdminToken;
