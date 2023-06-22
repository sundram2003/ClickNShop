const express = require('express');
const { registerController, loginController, testController } = require('../controllers/authController');
const { requireSignIn, isAdmin } = require('../middlerwares/authMiddleware');
const router = express.Router();

//routes->
//REGiSTER || POST 
router.post("/register", registerController);
//Login || POST
router.post("/login", loginController);
//test route
router.get("/test", requireSignIn, isAdmin, testController);
module.exports = router;