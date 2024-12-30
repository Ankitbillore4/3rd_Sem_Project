const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const flash = require("express-flash");
const session = require("express-session");
const User = require("./models/user");
const auth = require("./middleware/auth");

dotenv.config();

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === "production" }  // Use secure cookies in production
}));
app.use(flash());  // Use flash middleware for messages

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/index", (req, res) => {
  res.render("indexabout");
})
app.get("/about", (req, res) => {
  res.render("indexabout");
})

app.get("/contact", (req, res) => {
  res.render("indexcontact");
})
app.get("/details", (req, res) => {
  res.render("indexdetails");
})

// Login route
app.get("/login", (req, res) => {
  // Send flash message and email back in case of failed login attempt
  res.render("login", { 
    message: req.flash('error'),  // Display flash message
    email: req.flash('email')[0]  // Keep the email for persistence after failed login
  });
});

// Sign-up route
app.get("/signup", (req, res) => {
  res.render("signup");
});

// Handle sign-up POST request
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      req.flash("error", "User already exists.");
      return res.redirect("/signup");
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate a token and set as a cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true });

    req.flash("success", "User registered successfully.");
    res.redirect("/");  // Redirect to home page after successful sign-up
  } catch (error) {
    console.error("Signup error:", error);
    req.flash("error", "Error signing up.");
    res.redirect("/signup");
  } 
});

// Handle login POST request
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid credentials.');  // Flash message for invalid username
      req.flash('email', email);  // Store email for persistence after failed login
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Invalid credentials.');  // Flash message for wrong password
      req.flash('email', email);  // Store email for persistence after failed login
      return res.redirect('/login');
    }

    // Generate a token and set as a cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/");  // Redirect to home page after successful login
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "Error logging in.");
    res.redirect("/login");
  }
});

// Logout route
app.get("/logout", (req, res) => {
  res.clearCookie("token");  // Clear the token cookie on logout
  req.flash("success", "Successfully logged out.");
  res.redirect("/login");  // Redirect to login page
});

// Protected route (requires authentication)
app.use(auth);  // Use authentication middleware before defining the route

app.get("/dashboard", (req, res) => {
  res.render("dashboard", { user: req.user });  // Display user info after authentication
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
