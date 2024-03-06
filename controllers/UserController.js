import { UserModel } from '../models/User.js';
import bcrypt from 'bcryptjs';

async function get_user(req, res) {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                type: "error",
                message: "User not found"
            });
        }
        const { password, ...data } = user._doc;
        res.status(200).json({
            type: "success",
            data
        });

    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong, please try again",
            err
        });
    }
}

    /* get all users */
    async function get_users(req, res) {
        try {
            const users = await UserModel.find();
            res.status(200).json({
                type: "success",
                users
            });
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong, please try again",
                err
            });
        }
    }

    /* get user stats */
    async function get_stats(req, res) {
        const date = new Date();
        const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    
        try {
            const data = await UserModel.aggregate([
                { $match: { createdAt: { $gte: lastYear } } }, // Filter users created in the last year
                { $project: { month: { $month: "$createdAt" } } }, // Project the month of creation
                { $group: { _id: "$month", total: { $sum: 1 } } }, // Group by month and count
                { $sort: { _id: 1 } } // Sort the results by month (_id) in ascending order
            ]);
    
            res.status(200).json({
                type: "success",
                data
            });
        } catch (err) {
            console.error("Error getting user stats:", err); // Log the error for debugging
            res.status(500).json({
                type: "error",
                message: "Something went wrong, please try again",
                err
            });
        }
    }
    

    /* delete user */
    async function delete_user(req, res) {
        try {
            await UserModel.findByIdAndDelete(req.params.id);
            res.status(200).json({
                type: "success",
                message: "User has been deleted successfully"
            });
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong, please try again",
                err
            });
        }
    }

    /* update user */
    async function update_user(req, res) {
        if(req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10)
        }
        
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, 
            { new: true }
            );
            res.status(200).json({
                type: "success",
                message: "User updated successfully",
                updatedUser
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong, please try again",
                err
            })
        }
    }

export {
    get_user,
    get_users,
    get_stats,
    delete_user,
    update_user
};
