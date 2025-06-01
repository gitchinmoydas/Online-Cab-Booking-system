const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');
const { sendSafetyAlert } = require('../services/ride.service');
const User = require('../models/user.model');



module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });   // from git hub actual code
   
        res.status(201).json(ride);

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        // console.log(pickupCoordinates);



        const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);
        console.log("captains : " + captainsInRadius);

        ride.otp = ""

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        captainsInRadius.map(captain => {

            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })

        })

    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }

};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } 
}

// module.exports.prebookRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//     try {
//         const ride = await rideService.prebookRide({
//             user: req.user._id,
//             pickup: req.body.pickup,
//             destination: req.body.destination,
//             vehicleType: req.body.vehicleType,
//             scheduledTime: new Date(req.body.scheduledTime)
//         });

//         return res.status(201).json({ message: 'Ride prebooked successfully', ride });
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// };


module.exports.getUserRideHistory = async (req, res) => {
    console.log("🎯 Reached getUserRideHistory");
    try {
        const userId = req.user._id;
        const rides = await rideService.getCompletedRidesByUser(userId);
        return res.status(200).json({ success: true, rides });
    } catch (error) {
        console.error('Error fetching user ride history:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ✅ In your controller
module.exports.triggerSafetyAlert = async (req, res) => {
    const { emergencyContacts, userName, location } = req.body;

    try {
        const message = `${userName} feels unsafe during their Zyber-Cab ride. Current location: ${location}`;

        // Send message to all emergency contacts
        const sendAll = emergencyContacts.map((contact) =>
            sendSafetyAlert({ to: contact, message })
        );

        await Promise.all(sendAll);

        res.status(200).json({ success: true, message: 'Alerts sent successfully.' });
    } catch (err) {
        console.error('Error sending safety alerts:', err);
        res.status(500).json({ success: false, message: 'Failed to send alerts.' });
    }
};


// controllers/userController.js


module.exports.updateEmergencyContacts = async (req, res) => {
    try {
        const userId = req.user._id;
        const { emergencyContacts } = req.body;

        if (!Array.isArray(emergencyContacts)) {
            return res.status(400).json({ message: 'Emergency contacts must be an array.' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { emergencyContacts },
            { new: true }
        );

        res.status(200).json({ success: true, data: user.emergencyContacts });
    } catch (err) {
        console.error('Update emergency contacts error:', err);
        res.status(500).json({ success: false, message: 'Failed to update emergency contacts.' });
    }
};




