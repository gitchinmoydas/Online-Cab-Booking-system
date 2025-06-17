const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Join event
        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log(`User ${userId} joined as ${userType}`);

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, {
                    socketId: socket.id,
                    isOnline: true
                });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, {
                    socketId: socket.id,
                    isOnline: true
                });

                const onlineCaptains = await captainModel.find({
                    isOnline: true,
                    'location.ltd': { $ne: null },
                    'location.lng': { $ne: null }
                });

                io.emit('online-captains', onlineCaptains);
            }
        });

        // Update captain location
        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || location.ltd == null || location.lng == null) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            });

            const onlineCaptains = await captainModel.find({
                isOnline: true,
                'location.ltd': { $ne: null },
                'location.lng': { $ne: null }
            });

            io.emit('online-captains', onlineCaptains);
        });

        // ✅ Update user location
        socket.on('update-location-user', async (data) => {
            const { userId, location } = data;

            if (!location || location.ltd == null || location.lng == null) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await userModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            });

            // Optional: emit to captains/admins/etc.
            // io.emit('user-location-update', { userId, location });
        });


        // Chat message between user and captain
        socket.on('chat-message', async ({ senderId, receiverId, message, senderType }) => {
            try {
                let receiver;
                if (senderType === 'user') {
                    receiver = await captainModel.findById(receiverId);
                } else {
                    receiver = await userModel.findById(receiverId);
                }

                if (receiver && receiver.socketId) {
                    io.to(receiver.socketId).emit('chat-message', {
                        senderId,
                        message,
                        senderType,
                        timestamp: new Date()
                    });
                }
            } catch (err) {
                console.error('Error sending chat message:', err);
            }
        });


        // Disconnect
        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);

            const captain = await captainModel.findOneAndUpdate(
                { socketId: socket.id },
                { isOnline: false },
                { new: true }
            );

            const onlineCaptains = await captainModel.find({
                isOnline: true,
                'location.ltd': { $ne: null },
                'location.lng': { $ne: null }
            });

            io.emit('online-captains', onlineCaptains);

            // Optional: handle user disconnection too
            await userModel.findOneAndUpdate(
                { socketId: socket.id },
                { isOnline: false }
            );
        });


    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
};

module.exports = { initializeSocket, sendMessageToSocketId };
