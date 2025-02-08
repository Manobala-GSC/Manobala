import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';

const adminAuth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user || user.email !== 'gscteam12345@gmail.com') {
            return res.status(403).json({
                success: false,
                message: "Admin access denied"
            });
        }
        
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

export default adminAuth; 