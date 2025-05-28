const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
    },
    pickup: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    fare: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'scheduled', 'ongoing', 'completed', 'cancelled'],
        default: 'pending',
    },
    duration: {
        type: Number, // in seconds
    },
    distance: {
        type: Number, // in meters
    },
    otp: {
        type: String,
        select: false,
        required: true,
    },
    paymentID: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },

    // 🆕 Prebooking-related fields
    isPrebooked: {
        type: Boolean,
        default: false,
    },
    scheduledTime: {
        type: Date, // time when the ride is scheduled
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('ride', rideSchema);
