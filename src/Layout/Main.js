import React from 'react';
import { FaHome, FaKey, FaUser } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';

const Main = () => {
    return (
        <div className=''>
            <div className='flex gap-6 mx-[10%] min-h-screen'>
                <div className='w-[20%] mt-10 min-h-screen shadow-md p-4'>
                    <ul className='flex flex-col gap-6'>
                        <li className='hover:text-orange-500 text-xl'><Link className='flex gap-1 items-center'><FaHome />Home</Link></li>
                        <li className='hover:text-orange-500 text-xl'><Link className='flex gap-1 items-center'><FaUser />Employee</Link></li>
                        <li className='hover:text-orange-500 text-xl'><Link to='/add-employee' className='flex gap-1 items-center'><FaKey />Add Employee</Link></li>
                    </ul>
                </div>
                <div className='w-[80%]'>
                    <Outlet />
                </div>
            </div>
            <div className='text-center p-4 bg-black text-white'>
                Copyright @2024
            </div>
        </div>
    );
};

export default Main;