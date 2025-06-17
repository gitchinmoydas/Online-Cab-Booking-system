import React, { useRef, useState } from 'react'
import logo from './logo.png'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
// import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import LiveTracking from '../components/LiveTracking'
import UserChatBox from '../components/UserChatBox'
import CaptainChatBox from '../components/CaptainChatBox'


const CaptainHome = () => {

    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ride, setRide] = useState(null)
    const [rideData, setRideData] = useState(null);
    const [analytics, setAnalytics] = useState()
    // let rideData;

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)


    useEffect(() => {
        socket.emit('join', {
            userId: captain._id,

            userType: 'captain'
        })
        // console.log("This is captain id : ", captain._id);
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    console.log({
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })

                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        // return () => clearInterval(locationInterval)

        const fetchAnalytics = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/analytics`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log("Data ", res.data)
                setAnalytics(res.data);
            } catch (err) {
                console.error('Error fetching analytics:', err);
            }
        };

        fetchAnalytics();
        // console.log("analytics",analytics);

    }, [])

    socket.on('new-ride', (data) => {
        // console.log("Test new ride "+data);

        setRide(data)
        setRidePopupPanel(true)

    })


    async function confirmRide() {

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {

            rideId: ride._id,
            captainId: captain._id,


        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        // console.log("Ride user  data ",response.data.user._id); 
        // console.log("Ride data captain ",response.data.captain._id); 
        setRideData(response.data);
        //  console.log("data -> ",rideData.user);


        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)

    }

    const cancelRide = async () => {
        try {
            const res=await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/cancel`, {
                rideId: ride._id,
                cancelledBy: 'captain'
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Optional: Emit socket event to notify user
            socket.emit('ride-cancelled', { rideId: ride._id });
            console.log(res.data);

            // Hide popup after cancelling
            // setRidePopupPanel(false);
            setRide(null);
        } catch (error) {
            console.error('Error cancelling ride:', error);
        }
    };




    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ridePopupPanel])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePopupPanel])

    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen z-10'>
                <img className='w-32 absolute left-15 top-5 rounded-2xl ' src={logo} alt="" />

                <div className="absolute right-5 top-5 flex items-center gap-x-4">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login'; // or use navigate('/login') if using useNavigate
                        }}
                        className="bg-amber-200 hover:bg-amber-400 text-amber-950 px-4 py-2 rounded-md text-sm shadow-amber-50"
                    >
                        Logout
                    </button>
                </div>


                <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full '>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-3/5'>
                <LiveTracking />
                {/* <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" /> */}


            </div>
            <div className='h-2/5 p-6'>
                <CaptainDetails analytics={analytics} />
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0  bg-white px-3 py-10 pt-12'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                    
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp
                    rideData={rideData}
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} 
                    cancelRide={cancelRide} // 👈 pass it here
                    />

                {/* 👇 ChatBox appears only when ride is ongoing/confirmed */}
                {/* {ride && (
                    <CaptainChatBox ride={rideData} />
                )} */}
            </div>
        </div>
    )
}

export default CaptainHome