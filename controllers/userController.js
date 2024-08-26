const User = require('../models/user');
const adminController = require('./adminController');
// Render Signup Page
exports.getSignup = (req, res) => {
  res.render('signup');
};

// Handle User Signup
exports.postSignup = async (req, res) => {
  const { username, password,isAdmin } = req.body;
  try {
    const user = new User({ username, password ,isAdmin});
    await user.save();
    res.redirect('/login');
  } catch (err) {
    res.render('signup', { error: err.message });
  }
};

// Render Login Page
exports.getLogin = (req, res) => {
  // Check if there is an active session and the user is logged in
  if (req.session && req.session.user) {
    return res.redirect('/home');
  }

  // If no active session or user is not logged in, render the login page
  res.render('login', { error: undefined });
};


// Handle User Login
exports.postLogin = async (req, res) => {
    const { username, password, isAdmin } = req.body;
    
    try {
      const user = await User.findOne({ username});
      if (user && (await user.matchPassword(password))) {
        if (isAdmin) {
          req.session.admin = user;
          return res.redirect('/admin/users');
        } else if (!isAdmin && !user.isAdmin) {
          req.session.user = user;
          
          
          // return res.redirect('/home');
          res.status(200).json({ success: true });
        } else {
          res.render('login', { error: 'Invalid login credentials' });
        }
      } else {
        res.render('login', { error: 'Invalid username or password' });
      }
    } catch (err) {
      res.render('login', { error: err.message });
    }
  };
  

// Render Home Page for Logged In User
exports.getHome = (req, res) => {
  if (!req.session.user) {
    
    return res.redirect('/login');
  }
  // console.log("this sdhold be print 2 ruimes ");
  res.render('home', { user: req.session.user });
};

// Handle Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.redirect('/home'); // Optionally handle this better
    }

    // Clear the session cookie
    res.clearCookie('connect.sid', { path: '/' }); // Replace 'connect.sid' with the actual name of your session cookie if different

    // After destroying the session and clearing the cookie, redirect to the login page
    return res.redirect('/login');
  });
};
