import React from 'react'
import { Link, useLocation } from 'react-router-dom' // Added useLocation
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/Livetracking'
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';




const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {} // Retrieve ride data
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    socket.on("ride-ended", () => {
        navigate('/home')
    })


    const getReadableAddress = async (lat, lng) => {
        try {
            const response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=1dc9da3411c649d0a6681dd3e2d14d78`
            );
            const components = response.data.results[0].formatted;
            return components; // returns full address string
        } catch (error) {
            console.error("Error in reverse geocoding:", error);
            return `Lat: ${lat}, Lng: ${lng}`; // fallback
        }
    };



    const sendAlert = async () => {
        const emergencyContact = '+919382204187';
        const token = localStorage.getItem('token');

        try {
            // 1️⃣ Get user profile for name
            const profileRes = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/users/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const { firstname, lastname } = profileRes.data.fullname;
            const userName = `${firstname} ${lastname}`;

            // 2️⃣ Get location using Geolocation API
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    // 🔁 Get readable address via Google Maps API
                    const addressRes = await axios.get(
                        `https://maps.googleapis.com/maps/api/geocode/json`,
                        {
                            params: {
                                latlng: `${latitude},${longitude}`,
                                key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                            }
                        }
                    );

                    const location =
                        addressRes.data.status === 'OK' && addressRes.data.results.length > 0
                            ? addressRes.data.results[0].formatted_address
                            : `Lat: ${latitude}, Lng: ${longitude}`;

                    // 3️⃣ Send safety alert with name + location
                    const res = await axios.post(
                        `${import.meta.env.VITE_BASE_URL}/rides/alert`,
                        {
                            emergencyContact,
                            userName,
                            location
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    if (res.data.success) {
                        toast.success('Safety alert sent successfully!',{
                    autoClose: 500, 
                });
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error.message);
                    toast.error(' Failed to get location.',{
                    autoClose: 500, 
                });
                }
            );
        } catch (err) {
            console.error('Error:', err.response?.data || err.message);
            alert('Failed to send safety alert.');
        }
    };





    return (
        <div className='h-screen'>
            <Link to='/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                <i className="text-lg font-medium ri-home-5-line"></i>
            </Link>
            <div className='h-1/2'>
                <LiveTracking />
                {/* <img className='h-full w-full object-cover' src="https://miro.medium.com/max/1280/0*gwMx05pqII5hbfmX.gif" alt="img" /> */}

            </div>
            <div className='h-1/2 p-4'>
                <div className='flex items-center justify-between'>
                    <img className='h-12' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                    <div className='text-right'>
                        <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname}</h2>
                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
                        <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>

                    </div>
                </div>

                <div className='flex gap-2 justify-between flex-col items-center'>
                    <div className='w-full mt-5'>

                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-2-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>562/11-A</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{ride?.destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹{ride?.fare} </h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Make a Payment</button>
                {/* 🆘 SOS Button */}
                <button
                    onClick={sendAlert}
                    className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 animate-pulse hover:animate-none z-50"
                >
                    <AlertTriangle className="w-5 h-5" />
                    SOS
                </button>

            </div>
        </div>
    )
}

export default Riding