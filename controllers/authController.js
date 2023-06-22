const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel');
const JWT = require('jsonwebtoken');
exports.registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    //validation
    if (!name || !email || !password || !phone || !address) {
      return res.send({ error: 'All fields are Requires' });
    }
    //existingUser
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: 'User Already Register. Please login',
      });
    }
    //hash the password
    const hashedPassword = await hashPassword(password);
    //create Entry in database
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    return res.status(201).send({
      success: true,
      message: 'User is Registered Successfully.',
      user,
    });

  } catch (error) {
    console.log("Error in registrations : ", error);
    return res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    })
  }
}


//POST LOGIN
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "All Fields are Required",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    console.log("User is login successfully");
    console.log("UserDetails : ", user);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
//test controllers
exports.testController = async (req, res) => {
  res.send('Protected Route');
}
