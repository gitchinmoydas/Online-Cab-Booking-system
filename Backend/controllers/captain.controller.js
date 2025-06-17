const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blackListToken.model');
const { validationResult } = require('express-validator');
const Ride = require('../models/ride.model');


module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }


    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });

}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
} 


exports.getCaptainAnalytics = async (req, res) => {
 const captainId = req.captain._id; // assuming JWT middleware sets req.user

  try {
    const rides = await Ride.find({ captain: captainId });

    const completedRides = rides.filter(r => r.status === 'completed');
    const acceptedRides = rides.filter(r => r.status === 'accepted' || r.status === 'completed' || r.status === 'ongoing');
    const cancelledRides = rides.filter(r => r.status === 'cancelled');

    // Calculate monthly earnings
    const now = new Date();
    const thisMonthRides = completedRides.filter(r =>
      new Date(r.createdAt).getMonth() === now.getMonth() &&
      new Date(r.createdAt).getFullYear() === now.getFullYear()
    );
    const monthlyEarnings = thisMonthRides.reduce((sum, ride) => sum + (ride.fare || 0), 0);

    // Ratings & Reviews
    const ratings = completedRides
      .filter(r => r.rating)
      .map(r => r.rating);

    const reviews = completedRides
      .filter(r => r.review)
      .map(r => ({ review: r.review, rating: r.rating }));

    const averageRating = ratings.length
      ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(2)
      : null;

    // Acceptance / Cancellation Rate
    const totalRequests = rides.length;
    console.log("totalRequests ",totalRequests);
    console.log("acceptedRides ",acceptedRides.length);
    const acceptanceRate = totalRequests ? ((acceptedRides.length / totalRequests) * 100).toFixed(2) : '0.00';
    const cancellationRate = totalRequests ? ((cancelledRides.length / totalRequests) * 100).toFixed(2) : '0.00';

    res.status(200).json({
      monthlyEarnings,
      averageRating,
      reviews,
      acceptanceRate,
      cancellationRate,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching captain analytics', error: error.message });
  }
};