import express from 'express';
import Admin from '../models/adminModal.js';
import bcrypt from 'bcrypt';

const adminRoutes = express();

adminRoutes.post('/login', async (req, res) => {
  try {
    const admin = await Admin.findOne({
      mobile_no: req.body.mobile_no,
    });
    if (admin) {
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        admin.password
      );

      if (isPasswordValid) {
        res.status(200).send({
          success: true,
          message: 'Login successful.',
          data: admin,
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
        message: 'Admin Not Found.',
      });
    }
  } catch (error) {
    res.status(404).json({ success: false, message: e.message });
  }
});

adminRoutes.post('/signup', async (req, res) => {
  console.log(req.body);
  try {
    const findEmail = await Admin.findOne({
      email: req.body.email,
    });
    const findMobile = await Admin.findOne({
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
        const newAdmin = new Admin({
          business_name: req.body.business_name,
          email: req.body.email,
          mobile_no: req.body.mobile_no,
          alt_mobile_no: req.body.alt_mobile_no,
          password: req.body.password,
          lat: req.body.lat,
          lng: req.body.lng,
          description: req.body.description,
          address: req.body.address,
          img: req.body.img,
          time: req.body.time,
        });
        const admin = await newAdmin.save();
        res.status(201).send({
          success: true,
          message: 'Admin Registered Succesfully.',
          data: admin,
        });
      }
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

export default adminRoutes;
