import express from 'express';
import Admin from '../models/adminModal.js';
import User from '../models/userModal.js';
import Appointment from '../models/appointmentModal.js';
import Notification from '../models/notificationModal.js';

const appointmentRoute = express.Router();

appointmentRoute.post('/add_appointment', async (req, res) => {
  try {
    const { userId, adminId, msg } = req.body;
    const findAdmin = await Admin.findById(adminId);
    if (findAdmin) {
      const findUser = await User.findById(userId);
      if (findUser) {
        const newAppointment = new Appointment({
          admin: findAdmin,
          user: findUser,
          msg: msg,
        });
        await newAppointment.save();
        res.status(200).send({
          success: true,
          message: 'Add Appointment Successfully.',
        });
      } else {
        res.status(404).send({
          success: false,
          message: 'User Not Found.',
        });
      }
    } else {
      res.status(404).send({
        success: false,
        message: 'Shop Not Found.',
      });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

appointmentRoute.get('/get_all_appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const findApointment = await Appointment.find({ admin: id });

    if (findApointment) {
      // Calculate usersAhead count for each appointment
      const appointmentsWithUsersAhead = await Promise.all(
        findApointment.map(async (appointment) => {
          const usersAheadCount = await appointment.usersAhead;
          return { ...appointment.toObject(), usersAheadCount };
        })
      );
      // Get the count of users ahead using the virtual property
      //   const usersAheadCount = await findApointment.usersAhead;
      res.status(200).send({
        success: true,
        message: 'Appointment Get Successfully.',
        // usersAheadCount,
        data: appointmentsWithUsersAhead,
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'Shop Not Found.',
      });
    }
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

appointmentRoute.get('/change_status/:id/:status', async (req, res) => {
  try {
    const { id, status } = req.params;
    const findApointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (status === 'completed') {
      youAreNextNotification();
    }
    res.status(200).send({
      success: true,
      message: `Appointment ${status}.`,
      data: findApointment,
    });
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
});

async function youAreNextNotification() {
  const findApointment = await Appointment.findOne({ status: 'scheduled' });
  const newNotification = new Notification({
    userId: findApointment.user,
    title: 'You are next.',
    description: 'You are next in line so be prepared for coming.',
  });
  newNotification.save();
}

export default appointmentRoute;
