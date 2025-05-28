import React, { useEffect, useRef, useState } from 'react'
import logo from './logo.png'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmedRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
// import LiveTracking from '../components/Livetracking';
import PrebookRide from '../components/PrebookRide';
import LiveTracking from '../components/LiveTracking';
import { Menu } from 'lucide-react';



const Home = () => {

  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef(null)
  const panelCloseRef = useRef(null)
  const vehiclePanelRef = useRef(null)
  const confirmRidePanelRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const waitingForDriverRef = useRef(null)

  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [vehicleType, setVehicleType] = useState(null)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [activeField, setActiveField] = useState(null)
  const [fare, setFare] = useState({})
  const [isOpen, setIsOpen] = useState(false);


  const [ride, setRide] = useState(null)
  const [location, setLocation] = useState({ latitude: null, longitude: null })


  const navigate = useNavigate()

  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserDataContext)

  useEffect(() => {
    if (!socket || !user) return;

    // Emit 'join' event when component mounts
    socket.emit("join", { userType: "user", userId: user._id });

    // Start watching position
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        // Emit real-time location to server
        socket.emit("user-location", {
          userId: user._id,
          latitude,
          longitude
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
      }
    );

    // Cleanup the watcher on unmount
    return () => navigator.geolocation.clearWatch(watchId);
  }, [socket, user]);

  socket.on('ride-confirmed', ride => {


    setVehicleFound(false)
    setWaitingForDriver(true)
    setRide(ride)
  })

  socket.on('ride-started', ride => {
    console.log("ride")
    setWaitingForDriver(false)
    navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
  })



  const handlePickupChange = async (e) => {
    setPickup(e.target.value)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { input: e.target.value },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }

      })
      setPickupSuggestions(response.data)
    } catch {
      // handle error
    }
  }

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { input: e.target.value },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setDestinationSuggestions(response.data)
    } catch {
      // handle error
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
  }
  useGSAP(function () {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '70%',
        padding: 24
        // opacity:1
      })
      gsap.to(panelCloseRef.current, {
        opacity: 1
      })
    } else {
      gsap.to(panelRef.current, {
        height: '0%',
        padding: 0
        // opacity:0
      })
      gsap.to(panelCloseRef.current, {
        opacity: 0
      })
    }
  }, [panelOpen])


  useGSAP(function () {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehiclePanel])

  useGSAP(function () {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [confirmRidePanel])

  useGSAP(function () {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehicleFound])

  useGSAP(function () {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [waitingForDriver])



  async function findTrip() {
    setVehiclePanel(true)
    setPanelOpen(false)

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
      params: { pickup, destination },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })


    setFare(response.data)


  }

  async function createRide() {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
      pickup,
      destination,
      vehicleType
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })


  }



  return (
    <div className='h-screen relative overflow-hidden'>
       <div className="absolute top-5 left-5 z-30 flex items-center gap-x-30">
      <img className="w-36" src={logo} alt="logo" />

      <div className="relative px-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
        >
          <Menu className="w-6 h-6 text-gray-700" />

        </button>

        {isOpen && (
          <div className="absolute left-0 mr-1 mt-2 w-20 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <Link
              to="/ride-history"
              className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              History
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-red-600"
            >
              Logout
            </button>
            {/* <button
              onClick={() => {
                navigate("/prebooking");
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-red-600"
            >
              Prebooking
            </button> */}
          </div>
        )}
      </div>
    </div>


      <div className='h-screen w-screen'>
        {/* image for temporary use  */}
        {/* <img className='h-full w-full object-cover' src="https://miro.medium.com/max/1280/0*gwMx05pqII5hbfmX.gif" alt="img" /> */}
        <LiveTracking />
      </div>
      <div className=' flex flex-col justify-end h-screen absolute top-0 w-full'>
        <div className='h-[30%] p-6 bg-white relative'>
          <h5 ref={panelCloseRef} onClick={() => {
            setPanelOpen(false)
          }} className='absolute opacity-0 right-6 top-6 text-2xl'>
            <i className="ri-arrow-down-line"></i>
          </h5>
          <h4 className='text-2xl font-semibold '>Find a trip</h4>
          <form className='relative py-3' onSubmit={(e) => {
            submitHandler(e)
          }}>
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true)
                setActiveField('pickup')
              }}

              value={pickup}
              onChange={handlePickupChange}

              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
              type="text"
              placeholder='Add a pick-up location'
            />
            <input
              onClick={() => {
                setPanelOpen(true)
                setActiveField('destination')
              }}
              value={destination}
              onChange={handleDestinationChange}

              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
              type="text"
              placeholder='Enter your destination' />
          </form>
          <button
            onClick={findTrip}

            className='bg-emerald-600 text-white px-4 py-2 rounded-lg mt-3 w-full'>
            Find Trip
          </button>
          {/* <PrebookRide/> */}
        </div>

        {/* <div className=' bg-red-500 h-0'>

        </div> */}



        <div ref={panelRef} className='bg-white h-0'>
          <LocationSearchPanel
            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
            vehiclePanel={vehiclePanel}
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>

      </div>
      <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel}
        />

      </div>
      <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-14 pt-12'>
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}

          setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
      </div>
      <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-4 pt-15'>
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound} />
      </div>
      <div ref={waitingForDriverRef} className='fixed w-full  z-10 bottom-0 bg-white px-3 py-6 pt-12'>
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver} />


      </div>

    </div>


  )
}

export default Home