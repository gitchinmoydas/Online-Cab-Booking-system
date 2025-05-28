import React, { useEffect, useState } from 'react'
import axios from 'axios'
import logo from './logo.png'
import { Link } from 'react-router-dom'

const UserRideHistory = () => {
    const [rides, setRides] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchRideHistory = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/userhistory`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                console.log('Ride history response:', res.data)
                setRides(res.data.rides || [])
            } catch (err) {
                console.error('Error fetching ride history:', err)
                setError('Failed to fetch ride history')
                setRides([])
            } finally {
                setLoading(false)
            }
        }

        fetchRideHistory()
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-lg font-medium text-gray-600">Loading ride history...</p>
        </div>
    )

    if (error) return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-lg font-medium text-red-500">{error}</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 relative">
            {/* Top Navbar */}
            <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-x-4">
                    <img className="w-36" src={logo} alt="logo" />
                </div>
                <Link
                    to='/home'
                    className='h-10 w-10 bg-blue-100 hover:bg-blue-200 flex items-center justify-center rounded-full transition duration-200'
                    title="Go Home"
                >
                    <i className="text-xl text-blue-600 ri-home-4-line"></i>
                </Link>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto pt-32 px-4 sm:px-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Completed Rides</h2>

                {(rides || []).length === 0 ? (
                    <div className="text-center text-gray-600">
                        <p>No completed rides found.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {rides.map((ride) => (
                            <div
                                key={ride._id}
                                className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-200"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                                    <p><span className="font-semibold">Pickup:</span> {ride.pickup}</p>
                                    <p><span className="font-semibold">Destination:</span> {ride.destination}</p>
                                    <p><span className="font-semibold">Fare:</span> ₹{ride.fare}</p>
                                    <p><span className="font-semibold">Status:</span> {ride.status}</p>
                                    <p><span className="font-semibold">Driver Name:</span> {ride.captain.fullname.firstname} {ride.captain.fullname.lastname}</p>
                                    <p><span className="font-semibold">Date:</span> {new Date(ride.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserRideHistory
