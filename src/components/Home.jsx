import React from 'react'
import HeroImage from '../assets/heroImage.png';
import { MdKeyboardArrowRight} from "react-icons/md";
import {Link} from "react-scroll";

const Home = () => {
  return (
    <div name='home' className=' flex justify-center bg-gradient-to-b from-black via-black to-gray-800'>
        <div className='max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-full'>
            {/* px */}
            <div className='flex flex-col justify-center h-full px-4 pt-2'>
                <p className='text-4xl sm:text-7xl font-bold text-green-500 pt-20' >
                Gerardo Amaya
                </p>
                <p className="text-gray-300 py-4 text-lg">
                I am a Computer Science Engineering student and I like web programming 
                in ReactJS with Tailwind, API REST with NodeJS using the technologys of Express, 
                Moongose and Docker, mobile applications with Kotlin and working with github in team.
                Another branch of computing that I like is databases in Oracle PL/SQL and Microsoft SQL server T-SQL.
                
                </p>
                <div>
                    <Link to = "portfolio" 
                    smooth 
                    duration={500}
                    className="group text-white w-fit px-6 py-3 my-2 flex items-center rounded-md 
                    bg-gradient-to-r from-emerald-600 to-green-400 cursor-pointer">
                        Portfolio
                        <span className='group-hover:rotate-90 duration-300'>
                            <MdKeyboardArrowRight size={25} 
                            className="ml-1" />
                        </span>
                    </Link>
                </div>
                
            </div>
            <div className='flex-1 md:mt-0 mt-6 flex justify-center'>
            <div className='lg:w-60 h-full md:w-10/12 w-52'>
                <img src={HeroImage} alt="My pp" 
                className='w-full object-cover rounded-xl'/>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Home