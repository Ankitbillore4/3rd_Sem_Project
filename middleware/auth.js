const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // If no token is found in the cookies, redirect to login
    return res.redirect("/login");
  }

  try {
    // Verify the token using the secret from environment variables
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;  // Attach the verified user data to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    // If token verification fails, clear the token cookie and redirect to login
    console.error("Authentication error:", error);
    res.clearCookie("token");
    req.flash("error", "Session expired or invalid. Please log in again.");
    res.redirect("/login");
  }
};

module.exports = auth;
