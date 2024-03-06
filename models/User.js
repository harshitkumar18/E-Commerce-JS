import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    isAdmin: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true }
);

// Create a Mongoose model based on the schema
const UserModel = model('User', UserSchema);

// Adding a findOne function
const findOne = async (query) => {
    return await UserModel.findOne(query);
};

export { UserSchema, UserModel, findOne };  // Exporting the UserSchema, UserModel, and findOne function
