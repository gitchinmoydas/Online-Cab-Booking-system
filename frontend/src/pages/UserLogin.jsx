import React, { useState } from 'react'
import logo from './logo.png'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserLogin = () => {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [userData , setUserData]=useState({});

    const {user ,setUser}= React.useContext(UserDataContext);
    const navigate = useNavigate();

    const submitHandler=async(e)=>{
        e.preventDefault();
        const userData={
            email : email,
            password : password
        }

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)
        if (response.status === 200) {
            const data = response.data
            setUser(data.user)
            localStorage.setItem('token', data.token)
            navigate('/home')
          }
      

        setEmail('');
        setPassword('');
        // console.log(userData)
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
                    <p className='text-center'>New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link></p>
                </form>
            </div>
            <div>
                <Link
                    to='/captain-login'
                    className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
                >Sign in as Captain</Link>            
             </div>
        </div>
    )
}

export default UserLogin