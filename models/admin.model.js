const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin',
  },
  permissions: {
    manage_users: {
      type: Boolean,
      default: true,
    },
    manage_captains: {
      type: Boolean,
      default: true,
    },
    manage_rides: {
      type: Boolean,
      default: true,
    },
    view_analytics: {
      type: Boolean,
      default: true,
    },
    manage_admins: {
      type: Boolean,
      default: false,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
