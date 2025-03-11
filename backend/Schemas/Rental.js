const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ListItem', // Reference to the item being rented
        required: true
    },
    rentDate: {
        type: Date,
        default: Date.now
    },
    returnDate: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const Rental = mongoose.model('Rental', RentalSchema);

module.exports = Rental;
