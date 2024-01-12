import React from 'react'
import HeroImage from '../assets/heroImage.png';
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-scroll";
import { BsFillPersonLinesFill } from "react-icons/bs";

const Home = () => {

  const links = [
    {
      id: 1,
      child: (
        <>
          Resume <BsFillPersonLinesFill size={30} className="ml-2" />
        </>
      ),
      href: "/resume.pdf",
      style: "rounded-br-md",
      download: true,
    },
  ]

  return (
    <div name='home' className=' flex justify-center bg-gradient-to-b from-black via-black to-gray-800'>
      <div className='max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-full'>
        {/* px */}
        <div className='flex flex-col justify-center h-full px-4 pt-2'>
          <p className='text-3xl sm:text-5xl font-bold text-green-500 pt-20' >
            Gerardo Amaya
          </p>
          <p className="text-gray-300 py-4 text-lg">
            I am Gerardo Amaya, a passionate FullStack web developer with diverse experience in the field of software development. 
            My primary focus it's in backend development, where manage technologies like PHP and the Laravel framework.
            My knowledge extends to databases like MySQL and Oracle.
            I possess skills in frontend development, including Vue.js, Node.js, and React.
            I can handle APIs and effective collaboration using Git and GitHub in collaborative projects.

          </p>
          <div className='flex'>
            <Link to="portfolio"
              smooth
              duration={500}
              className="group w-fit my-2 flex font-semibold items-center text-white bg-green-600 duration-200 hover:scale-105 hover:bg-green-700 focus:ring-4 focus:outline-none rounded-lg px-5 py-2.5 text-center mr-5 mb-2 cursor-pointer">
              Portfolio
              <span className='group-hover:rotate-90 duration-300'>
                <MdKeyboardArrowRight size={25}
                  className="ml-1" />
              </span>
            </Link>
            <button className="group w-fit my-2 flex items-center text-white bg-green-600 duration-200 hover:scale-105 hover:bg-green-700 focus:ring-4 focus:outline-none rounded-lg px-5 py-2.5 text-center mb-2">
              <a
                name="resume"
                href={links[0].href}
                className="flex justify-between items-center w-full text-white font-semibold"
                download={links[0].download}
                target="_blank"
                rel="noreferrer"
              >
                {links[0].child}
              </a>
            </button>

          </div>


        </div>
        <div className='flex-1 md:mt-0 mt-6 flex justify-center'>
          <div className='lg:w-40 h-full md:w-10/12 w-52'>
            <img src={HeroImage} alt="My pp"
              className='w-full object-cover rounded-xl' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home