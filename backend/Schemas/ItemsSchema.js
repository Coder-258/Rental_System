const mongoose = require('mongoose');

const ListItemSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller', // Reference to Seller model,
        required: true
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        min: 0
    },
    category: {
        type: String,
        enum: ['electronics', 'furniture', 'books', 'others']
    },
    availableFrom: {
        type: Date,
    },
    availableTo: {
        type: Date,
    },
    images: {
        type: [String], // Store image URLs
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isAvailable:{
        type: Boolean,
        default: true
    }
});

const ListItem = mongoose.model('ListItem', ListItemSchema);

module.exports = ListItem;
