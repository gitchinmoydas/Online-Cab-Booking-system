import React from 'react'
import logo from './logo.png'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <div className='bg-cover bg-center bg-[url(https://plus.unsplash.com/premium_photo-1731842686156-74895c29a87b?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-5 flex justify-between flex-col  w-full bg-red-400'>
        <img src={logo} className='w-35 ml-4' alt="IMG" />
            <div className='pb-7 bg-white px-4 py-4'>
                <h2 className='text-3xl font-bold'>Get Started with zyber-cab</h2>
                <Link to="/login" className='flex items-center justify-center w-full bg-lime-500 text-white py-3 rounded mt-5'>Continue</Link>
            </div>
        </div>

    </div>
  )
}

export default Home