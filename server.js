import 'dotenv/config.js';
import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import appointmentRoute from './routes/appointmentRoute.js';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

app.use('/api/v1.0/admin', adminRoutes);
app.use('/api/v1.0/user', userRoutes);
app.use('/api/v1.0/user', userRoutes);
app.use('/api/v1.0/appointment', appointmentRoute);

app.use((err, req, res, next) => {
  res.status(500).send({ success: false, message: err.message });
});

function started() {
  console.log(`Server is running at http://localhost:${port}`);
}

app.listen(port, started);
