const cron = require('node-cron');
const rideModel = require('../models/ride.model');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');

cron.schedule('*/1 * * * *', async () => {
    const now = new Date();
    const rides = await rideModel.find({
        isPrebooked: true,
        status: 'scheduled',
        scheduledTime: { $lte: now }
    }).populate('user');

    for (let ride of rides) {
        const pickupCoordinates = await mapService.getAddressCoordinate(ride.pickup);
        const captains = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

        ride.status = 'pending';
        await ride.save();

        captains.forEach(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: ride
            });
        });
    }

    console.log(`Prebooking dispatcher ran at ${now}`);
});