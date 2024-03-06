import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
    },
    size: {
        type: String
    },
    color: {
        type: String
    },
    price: {
        type: Number,
        required: true
    }
},
{ timestamps: true }
);

export default model('Product', ProductSchema);
