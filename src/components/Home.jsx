import React from 'react'
import HeroImage from '../assets/heroImage.png';
import { MdKeyboardArrowRight} from "react-icons/md";
import {Link} from "react-scroll";

const Home = () => {
  return (
    <div name='home' className='h-screen w-full bg-gradient-to-b from-black via-black to-gray-800 '>
        <div className='max-w-screen-lg mx-auto flex flex-col items-center justify-center h-full px-4 md:flex-row'>
            {/* px */}
            <div className='flex flex-col justify-center h-full px-4'>
                <h2 className='text-4xl sm:text-7xl font-bold text-green-500' >
                Gerardo Amaya
                </h2>
                <p className="text-gray-300 py-4 text-lg">
                I am a Computer Science Engineering student at UFG, I am 22 years old and I like web programming 
                in ReactJS with Tailwind, API REST with NodeJS using the technologys of Express, 
                Moongose and Docker, making basic mobile applications with Kotlin and working with github in team.
                Another branch of computing that I like is databases in Oracle Database PL/SQL and Microsoft SQL server T-SQL.
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
            <div>
                <img src={HeroImage} alt="My pp" 
                className='rounded-2xl mx-auto w-2/3 md:w-full '/>
            </div>
        </div>
    </div>
  )
}

export default Home