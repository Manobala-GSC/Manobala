import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    
    console.log('Checking auth with token:', token ? 'Token exists' : 'No token');
    
    if (!token) {
        return res.json({
            success: false,
            message: "Not Authorised. Login Again"
        });
    }
    
    try {
        console.log('JWT Secret exists:', !!process.env.JWT_SECRET);
        const tokendecode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', tokendecode);
        
        if (tokendecode.id) {
            req.body.userId = tokendecode.id;
            console.log('User ID set in request:', tokendecode.id);
        } else {
            console.log('No ID in token');
            return res.json({
                success: false,
                message: "Not Authorised. Login Again",
            });
        }
        
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
}

export default userAuth;