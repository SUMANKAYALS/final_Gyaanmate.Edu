import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// export const protect = async (req, res, next) => {
//   let token = req.headers.authorization?.startsWith('Bearer')
//     ? req.headers.authorization.split(' ')[1]
//     : null;

//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
//     req.user = await User.findById(decoded.id).select('-password');
//     if (!req.user) return res.status(401).json({ message: 'User not found' });
//     next();
//   } catch {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };


export const protect = async (req, res, next) => {
  try {
    console.log("Authorization Header:", req.headers.authorization);

    let token = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({
        message: "Not authorized - No token"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev_secret"
    );

    console.log("Decoded:", decoded);

    req.user = await User.findById(decoded.id).select("-password");

    console.log("User:", req.user);

    if (!req.user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    next();
  } catch (error) {
    console.log("Auth Error:", error.message);

    return res.status(401).json({
      message: error.message
    });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
