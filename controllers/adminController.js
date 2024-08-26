const User = require('../models/user');

exports.getAdminLogin = (req, res) => {
  res.render('admin/login');
};

exports.postAdminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await user.matchPassword(password)) {
      req.session.user = {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin
      };
    
      if (user.isAdmin) {
        return res.redirect('/admin/users'); // Redirect to admin users page if the user is an admin
      } else {
       return res.redirect('/'); // Redirect to home page if not an admin
      }
    } else {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/admin/login');
    }
  } catch (error) {
    console.error('Error during login:', error);
    req.flash('error', 'An error occurred during login');
    return res.redirect('/admin/login');
  }
 };



exports.getUsers = async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    res.redirect('/login');
  }

  try {
    const users = await User.find({ isAdmin: { $ne: true } }).select('-password');
    res.render('admin/users', { users });
  } catch (error) {
    console.error('Error fetching users:', error);
    req.flash('error', 'Error fetching users');
    res.redirect('/admin/login');
    next(err);
  }
};

exports.getuserUpdate = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/admin/users');
    }
    res.render('admin/userUpdate', { user });
  } catch (error) {
    console.error('Error fetching user:', error);
    req.flash('error', 'Error fetching user');
    res.redirect('/admin/users');
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { username,phone} = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username,phone },
      { new: true }
    );
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};
