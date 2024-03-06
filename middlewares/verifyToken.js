import jwt from 'jsonwebtoken';
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { UserModel } from "../models/User.js"; // Ensure this import is correct

// Assuming api.js correctly exports a configuration object
import { api } from "../config/api.js";

// JWT token verification middleware
export const authenticationVerifier = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }
    
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || api.jwt_secret); // Fallback to api.js config if environment variable is not set
        const user = await UserModel.findById(decodedToken.id).select("-password");
        
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token." });
        } else {
            next(error); // Pass errors to the error handling middleware
        }
    }
});

// Middleware to verify access level based on user roles or specific user access
export const accessLevelVerifier = async (req, res, next) => {
    try {
        authenticationVerifier(req, res, async () => {
            if (req.user.id === req.params.id || req.user.isAdmin) {
                next();
            } else {
                res.status(403).json("You are not allowed to perform this task");
            }
        });
    } catch (error) {
        // Handle or pass the error as appropriate
        next(error);
    }
};

// Middleware to verify if the current user is an admin
export const isAdminVerifier = async (req, res, next) => {
    try {
        authenticationVerifier(req, res, async () => {
            if (req.user.isAdmin) {
                next();
            } else {
                res.status(403).json("You are not allowed to perform this task");
            }
        });
    } catch (error) {
        // Handle or pass the error as appropriate
        next(error);
    }
};
