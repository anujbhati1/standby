import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  business_name: { type: String, required: true },
  mobile_no: {
    type: String,
    required: true,
    unique: [true, 'Mobile Number already exist.'],
  },
  alt_mobile_no: {
    type: String,
    unique: [true, 'Alternate Mobile Number already exist.'],
  },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  lat: { type: String },
  lng: { type: String },
  description: { type: String },
  address: { type: String },
  img: { type: String },
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
