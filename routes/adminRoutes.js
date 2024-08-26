const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const adminCheck = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
      next(); 
    } else {
      res.redirect('/home'); 
    }
  };
router.get('/login', adminController.getAdminLogin);
 router.post('/login', adminController.postAdminLogin);
router.get('/users', adminCheck,adminController.getUsers);
router.get('/userUpdate/:id', adminController.getuserUpdate);
router.get('/updateUser ',adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id',adminController.deleteUser);
module.exports = router;