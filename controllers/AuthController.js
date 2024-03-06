import bcrypt from 'bcryptjs';
import { UserModel , findOne} from '../models/User.js';

import jwt from 'jsonwebtoken';

const { sign } = jwt;

import { api } from '../config/api.js';

/* create new user */
async function create_user(req, res, next) {
    const newUser = new UserModel({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    });

    try {
        const user = await newUser.save();
        res.status(201).json({
            type: 'success',
            message: 'User has been created successfully',
            user,
        });
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyValue) {
            // Duplicate key error (email already exists)
            res.status(400).json({
                type: 'error',
                message: 'Email address is already in use',
            });
        } else {
            // Other errors
            res.status(500).json({
                type: 'error',
                message: 'Something went wrong, please try again',
                err,
            });
        }
    }
}


/* login existing user */
async function login_user(req, res) {
    const user = await findOne({ username: req.body.username });

    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
        res.status(500).json({
            type: 'error',
            message: 'User does not exist or invalid credentials',
        });
    } else {
        const accessToken = sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const { password, ...data } = user._doc;
        const options = {
            httpOnly: true,
            secure: true
        }

        
        res
        .cookie("accessToken", accessToken, options)
        
        .status(200).json({
            type: 'success',
            message: 'Successfully logged in',
            ...data,
            accessToken,
        });
    }
}
async function change_password(req, res) {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await findOne({ _id: req.user.id }); // Assuming you have user information in the request object

        if (!user || !bcrypt.compareSync(currentPassword, user.password)) {
            res.status(401).json({
                type: 'error',
                message: 'Invalid current password',
            });
        } else {
            // Update the user's password with the new hashed password
            user.password = bcrypt.hashSync(newPassword, 10);
            await user.save();

            res.status(200).json({
                type: 'success',
                message: 'Password has been changed successfully',
            });
        }
    } catch (err) {
        res.status(500).json({
            type: 'error',
            message: 'Something went wrong, please try again',
            err,
        });
    }
}

export { create_user, login_user, change_password };
