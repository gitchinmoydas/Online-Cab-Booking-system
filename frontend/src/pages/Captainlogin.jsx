import React, { useState } from 'react'
import logo from './logo.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'

const Captainlogin = () => {
   const [email,setEmail]=useState('');
      const [password,setPassword]=useState('');
      const {captain,setCaptain} = React.useContext(CaptainDataContext)
      const navigate = useNavigate();

      const submitHandler= async(e)=>{
          e.preventDefault();
          const captain={
              email : email,
              password
          }

          const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)

          if (response.status === 200) {
            const data = response.data
      
            setCaptain(data.captain)
            localStorage.setItem('token', data.token)
            navigate('/captain-home')
      
          }

          setEmail('');
          setPassword('');
          console.log(captain)
      }
  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
    <div>
        <form onSubmit={(e)=>{submitHandler(e)}} action="" className='p-4'>
            <img src={logo} className='w-35 mb-10' alt="IMG" />
            <h3 className='text-lg font-medium mb-2'>What's your email</h3>
            <input required value={email} onChange={(e)=>{setEmail(e.target.value)}} className='bg-[#eeeeee] rounded mb-7 px-4 py-2 border w-full text-lg placeholder:text-base' type="email" placeholder='email@example.com' />
            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
            <input required value={password} onChange={(e)=>{setPassword(e.target.value)} } className=' bg-[#eeeeee] rounded mb-7 px-4 py-2 border w-full text-lg placeholder:text-base' type="password" placeholder='password' />
            <button className=' bg-[#5a9ef0] text-white font-semibold rounded mb-3 px-4 py-2  w-full text-lg placeholder:text-base' >Login</button>
            <p className='text-center'>Join a fleet? <Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link></p>
        </form>
    </div>
    <div>
    <Link
          to='/login'
          className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
        >Sign in as User</Link>        
     </div>
</div>
  )
}

export default Captainlogin