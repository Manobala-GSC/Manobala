import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import { 
    getAllUsers, 
    updateUser, 
    deleteUser,
    getDashboardStats 
} from '../controllers/adminController.js';

const adminRouter = express.Router();

// Remove duplicate routes and keep only these clean routes
adminRouter.get('/users', adminAuth, getAllUsers);
adminRouter.put('/users/:userId', adminAuth, updateUser);
adminRouter.delete('/users/:userId', adminAuth, deleteUser);
adminRouter.get('/dashboard-stats', adminAuth, getDashboardStats);

export default adminRouter; 