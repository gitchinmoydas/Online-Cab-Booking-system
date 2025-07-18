import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import CaptainChatBox from './CaptainChatBox'

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()

  const submitHander = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          params: {
            rideId: props.ride._id,
            otp: otp,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (response.status === 200) {
        toast.success('OTP verified! Ride started.')
        props.setConfirmRidePopupPanel(false)
        props.setRidePopupPanel(false)
        navigate('/captain-riding', { state: { ride: props.ride } })
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.log(error);
        toast.error(error.response.data.message || 'Invalid OTP' , {
                    autoClose: 500, 
                })
      } else {
        toast.error('Something went wrong. Please try again.',{
                    autoClose: 500, 
                })
      }
    }
  }

  return (
    <div>
      <h5
        className='p-1 text-center w-[93%] absolute top-0'
        onClick={() => {
          props.setRidePopupPanel(false)
        }}
      >
        <i className='text-3xl text-gray-200 ri-arrow-down-wide-line'></i>
      </h5>

      <h3 className='text-2xl font-semibold mb-5'>Confirm this ride to Start</h3>

      <div className='flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-4'>
        <div className='flex items-center gap-3 '>
          <img
            className='h-12 rounded-full object-cover w-12'
            src='https://cdn.britannica.com/25/222725-050-170F622A/Indian-cricketer-Mahendra-Singh-Dhoni-2011.jpg'
            alt='User'
          />
          <h2 className='text-lg font-medium capitalize'>
            {props.rideData?.user.fullname.firstname}
          </h2>
        </div>
        <h5 className='text-lg font-semibold'>2.2 KM</h5>
      </div>

      <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full mt-5'>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className='ri-map-pin-user-fill'></i>
            <div>
              <h3 className='text-lg font-medium'>Pickup</h3>
              <p className='text-sm -mt-1 text-gray-600'>{props.rideData?.pickup}</p>
            </div>
          </div>

          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className='text-lg ri-map-pin-2-fill'></i>
            <div>
              <h3 className='text-lg font-medium'>Destination</h3>
              <p className='text-sm -mt-1 text-gray-600'>{props.rideData?.destination}</p>
            </div>
          </div>

          <div className='flex items-center gap-5 p-3'>
            <i className='ri-currency-line'></i>
            <div>
              <h3 className='text-lg font-medium'>₹{props.rideData?.fare}</h3>
              <p className='text-sm -mt-1 text-gray-600'>Cash</p>
            </div>
            {props.ride && (
                    <CaptainChatBox ride={props.rideData} />
                )} 
          </div>
        </div>

        <div className='mt-6 w-full'>
          <form onSubmit={submitHander}>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type='text'
              className='bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mt-3'
              placeholder='Enter OTP'
              required
            />

            <button
              type='submit'
              className='w-full mt-5 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg'
            >
              Confirm
            </button>

            <button
              type='button'
              onClick={() => {
                props.setConfirmRidePopupPanel(false)
                props.setRidePopupPanel(false)
                props.cancelRide();
              }}
              className='w-full mt-2 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg'
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ConfirmRidePopUp
