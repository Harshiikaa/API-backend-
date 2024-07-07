const jwt = require('jsonwebtoken');

// AUTHGURAD FOR USER
const authGuard = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.json({
            success: false,
            message: "Authorization header not found!"
        })
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.json({
            success: false,
            message: "Token not found!"
        })
    }
    try {
        // verify token
        const decodeUser = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        req.user = decodeUser;
        next();

    } catch (error) {
        res.json({
            success: false,
            message: "Invalid Token"
        })
    }
}

// AUTHGURAD FOR ADMIN
const authGuardAdmin = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.json({
            success: false,
            message: "Authorization header not found!"
        })
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.json({
            success: false,
            message: "Token not found!"
        })
    }

    try {
        console.log(token);
        const decodeUser = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        req.user = decodeUser;
        if (!req.user.isAdmin) {
            return res.json({
                success: false,
                message: "Permission denied!"
            })
        }
        next();

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Invalid Token"
        })
    }
}



module.exports = {
    authGuard,
    authGuardAdmin
};