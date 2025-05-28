// import React from 'react'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'

// export const UserLogout = () => {

//     const token = localStorage.getItem('token')
//     const navigate = useNavigate()

//     axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     }).then((response) => {
//         if (response.status === 200) {
//             localStorage.removeItem('token')
//             navigate('/login')
//         }
//     })

//     return (
//         <div>UserLogout</div>
//     )
// }

// export default UserLogout



import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-all"
            >
                Logout
            </button>
        </div>
    );
};

export default UserLogout;
