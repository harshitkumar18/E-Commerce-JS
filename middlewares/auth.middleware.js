import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log(token);
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken);

        // Use `decodedToken.id` to find the user
        const user = await UserModel.findById(decodedToken.id).select("-password");
        console.log(user);
        
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        
        req.user = user;
        next();
    } catch (error) {
        // Make sure to handle the error properly, for example:
        // If JWT verification throws an error, it should be caught here
        if (error.name === 'JsonWebTokenError') {
            // This means the JWT is invalid
            res.status(401).json({ message: "Invalid token." });
        } else {
            // For other kinds of errors, log them and respond with a 500 status code
            console.error("An error occurred in verifyJWT middleware", error);
            res.status(500).json({ message: "An error occurred during authentication." });
        }
    }
});
