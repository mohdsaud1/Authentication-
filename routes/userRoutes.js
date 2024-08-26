const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const app= express();

const nocache=(req, res, next) =>{
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
  }



router.get('/signup',nocache, userController.getSignup);
router.post('/signup',nocache, userController.postSignup);
router.get('/',nocache, userController.getLogin);
router.get('/login',nocache , userController.getLogin);
router.post('/login',nocache, userController.postLogin);
router.get('/home',nocache, userController.getHome);
router.get('/logout', userController.logout);

app.use(nocache);


module.exports = router;