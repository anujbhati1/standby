import express from 'express';
import User from '../models/userModal.js';
import bcrypt from 'bcrypt';

const userRoutes = express.Router();

userRoutes.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      mobile_no: req.body.mobile_no,
    });
    if (user) {
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (isPasswordValid) {
        res.status(200).send({
          success: true,
          message: 'Login successful',
          data: {
            _id: user._id,
            name: user.name,
            mobile_no: user.mobile_no,
            email: user.email,
          },
        });
      } else {
        res.status(404).send({
          success: false,
          message: 'Invalid Password.',
        });
      }
    } else {
      res.status(404).send({
        success: false,
        message: 'User Not Found.',
      });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

userRoutes.post('/signup', async (req, res) => {
  try {
    const findEmail = await User.findOne({
      email: req.body.email,
    });
    const findMobile = await User.findOne({
      mobile_no: req.body.mobile_no,
    });
    if (findEmail) {
      res.status(409).send({
        success: false,
        message: 'Email is already registered.',
      });
    } else {
      if (findMobile) {
        res.status(409).send({
          success: false,
          message: 'Mobile already registered.',
        });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          mobile_no: req.body.mobile_no,
          password: req.body.password,
        });
        const user = await newUser.save();
        res.status(201).send({
          success: true,
          message: 'User Registered Succesfully.',
          data: {
            _id: user._id,
            name: user.name,
            mobile_no: user.mobile_no,
            email: user.email,
          },
        });
      }
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

export default userRoutes;