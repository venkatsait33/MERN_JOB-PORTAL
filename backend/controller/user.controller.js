import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User already exists, try to login",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });
  } catch (error) {
    res.json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect Email",
        success: false,
      });
    }
      const isPasswordMatch = await bcrypt.compare(password, user.password); // compare password
       if (!isPasswordMatch) {
         return res.status(400).json({
           message: "Incorrect Email",
           success: false,
         });
      }
      if (role === user.role) { 
          return res.json({
              message: "Account doesn't exist with current role",
              success: false,
           })
      }
  } catch (error) {
    res.json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
