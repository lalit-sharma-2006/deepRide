const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminAuth = require('../middlewares/admin.middleware');

// ========== AUTH ROUTES ==========
router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.post('/logout', adminAuth.adminAuth, adminController.logoutAdmin);

// ========== DASHBOARD ==========
router.get('/dashboard/stats', adminAuth.adminAuth, adminController.getDashboardStats);

// ========== USER MANAGEMENT ==========
router.get('/users', adminAuth.adminAuth, adminController.getAllUsers);
router.get('/users/:userId', adminAuth.adminAuth, adminController.getUserById);
router.put('/users/:userId', adminAuth.adminAuth, adminController.updateUser);
router.delete('/users/:userId', adminAuth.adminAuth, adminController.deleteUser);

// ========== CAPTAIN MANAGEMENT ==========
router.get('/captains', adminAuth.adminAuth, adminController.getAllCaptains);
router.get('/captains/:captainId', adminAuth.adminAuth, adminController.getCaptainById);
router.put('/captains/:captainId', adminAuth.adminAuth, adminController.updateCaptain);
router.delete('/captains/:captainId', adminAuth.adminAuth, adminController.deleteCaptain);

// ========== ANALYTICS ==========
router.get('/analytics/rides', adminAuth.adminAuth, adminController.getRideAnalytics);

module.exports = router;
