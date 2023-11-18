import express from 'express';
import Admin from '../models/adminModal.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import { baseUrl, hashPassword } from '../utils/index.js';

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

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
        admin.img = baseUrl + admin.img;
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
    res.status(404).json({ success: false, message: error.message });
  }
});

adminRoutes.post('/signup', upload.single('img'), async (req, res) => {
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
        const hashedPassword = await hashPassword(req.body.password);
        const newAdmin = new Admin({
          business_name: req.body.business_name,
          email: req.body.email,
          mobile_no: req.body.mobile_no,
          alt_mobile_no: req.body.alt_mobile_no,
          password: hashedPassword,
          lat: req.body.lat,
          lng: req.body.lng,
          description: req.body.description,
          address: req.body.address,
          img: req.file.path,
          time: req.body.time,
        });
        const admin = await newAdmin.save();
        admin.img = baseUrl + admin.img;
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
