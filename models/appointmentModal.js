import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  msg: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a virtual property to calculate the number of users ahead of the current user
appointmentSchema.virtual('usersAhead').get(function () {
  return Appointment.countDocuments({
    admin: this.admin,
    status: 'scheduled',
    _id: { $lt: this._id },
  });
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
