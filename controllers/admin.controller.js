const AdminModel = require('../models/admin.model');
const UserModel = require('../models/user.model');
const CaptainModel = require('../models/captain.model');
const RideModel = require('../models/ride.model');
const blacklistTokenModel = require('../models/blacklistToken.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.registerAdmin = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingAdmin = await AdminModel.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await AdminModel.create({
      fullname: {
        firstname: fullname.firstname,
        lastname: fullname.lastname,
      },
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'admin',
    });

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        type: 'admin',
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Admin registered successfully',
      token,
      admin: {
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error registering admin:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const admin = await AdminModel.findOne({ email: email.toLowerCase() }).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await admin.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        type: 'admin',
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Admin logged in successfully',
      token,
      admin: {
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    console.error('Error logging in admin:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ========== ADMIN DASHBOARD ==========
module.exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalCaptains = await CaptainModel.countDocuments();
    const totalRides = await RideModel.countDocuments();
    const completedRides = await RideModel.countDocuments({ status: 'completed' });
    const cancelledRides = await RideModel.countDocuments({ status: 'cancelled' });

    // Calculate revenue (sum of all ride fares)
    const rides = await RideModel.find({ status: 'completed' });
    const totalRevenue = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0);

    return res.status(200).json({
      stats: {
        totalUsers,
        totalCaptains,
        totalRides,
        completedRides,
        cancelledRides,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ========== USER MANAGEMENT ==========
module.exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { 'fullname.firstname': new RegExp(search, 'i') },
          { 'fullname.lastname': new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { phone: new RegExp(search, 'i') },
        ],
      };
    }

    const users = await UserModel.find(query).skip(skip).limit(parseInt(limit));
    const totalUsers = await UserModel.countDocuments(query);

    return res.status(200).json({
      users,
      pagination: {
        totalUsers,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userRides = await RideModel.find({ userId });

    return res.status(200).json({
      user,
      ridesCount: userRides.length,
      rides: userRides.slice(0, 5), // Last 5 rides
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully', user });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullname, email, phone } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { fullname, email, phone },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ========== CAPTAIN MANAGEMENT ==========
module.exports.getAllCaptains = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { 'fullname.firstname': new RegExp(search, 'i') },
          { 'fullname.lastname': new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { phone: new RegExp(search, 'i') },
        ],
      };
    }

    const captains = await CaptainModel.find(query).skip(skip).limit(parseInt(limit));
    const totalCaptains = await CaptainModel.countDocuments(query);

    return res.status(200).json({
      captains,
      pagination: {
        totalCaptains,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCaptains / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching captains:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports.getCaptainById = async (req, res) => {
  try {
    const { captainId } = req.params;

    const captain = await CaptainModel.findById(captainId);
    if (!captain) {
      return res.status(404).json({ message: 'Captain not found' });
    }

    const captainRides = await RideModel.find({ captainId });

    return res.status(200).json({
      captain,
      ridesCount: captainRides.length,
      completedRides: captainRides.filter((r) => r.status === 'completed').length,
      totalEarnings: captainRides.reduce((sum, ride) => sum + (ride.fare || 0), 0),
      rides: captainRides.slice(0, 5), // Last 5 rides
    });
  } catch (error) {
    console.error('Error fetching captain:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports.deleteCaptain = async (req, res) => {
  try {
    const { captainId } = req.params;

    const captain = await CaptainModel.findByIdAndDelete(captainId);
    if (!captain) {
      return res.status(404).json({ message: 'Captain not found' });
    }

    return res.status(200).json({ message: 'Captain deleted successfully', captain });
  } catch (error) {
    console.error('Error deleting captain:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports.updateCaptain = async (req, res) => {
  try {
    const { captainId } = req.params;
    const { fullname, email, phone, vehicleDetails } = req.body;

    const captain = await CaptainModel.findByIdAndUpdate(
      captainId,
      { fullname, email, phone, vehicle: vehicleDetails },
      { new: true }
    );

    if (!captain) {
      return res.status(404).json({ message: 'Captain not found' });
    }

    return res.status(200).json({ message: 'Captain updated successfully', captain });
  } catch (error) {
    console.error('Error updating captain:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ========== RIDE ANALYTICS ==========
module.exports.getRideAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const rides = await RideModel.find(query);

    const analytics = {
      totalRides: rides.length,
      completedRides: rides.filter((r) => r.status === 'completed').length,
      cancelledRides: rides.filter((r) => r.status === 'cancelled').length,
      totalRevenue: rides.reduce((sum, r) => sum + (r.fare || 0), 0),
      averageFare: rides.length > 0 ? rides.reduce((sum, r) => sum + (r.fare || 0), 0) / rides.length : 0,
    };

    return res.status(200).json({ analytics });
  } catch (error) {
    console.error('Error fetching ride analytics:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports.logoutAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await blacklistTokenModel.create({ token });
    }

    return res.status(200).json({ message: 'Admin logged out successfully' });
  } catch (error) {
    console.error('Error logging out admin:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
