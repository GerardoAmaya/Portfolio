import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { FaInstagram } from "react-icons/fa";

const Contact = () => {

  const links = [
    {
      id: 1,
      child: (
        <>
          <FaLinkedin size={30} />
        </>
      ),
      href: "https://www.linkedin.com/in/gerardo-alberto-amaya-fuentes-20b292240",
      
    },
    {
      id: 2,
      child: (
        <>
          <FaGithub size={30} />
        </>
      ),
      href: "https://github.com/GerardoAmaya",
    },
    {
      id: 3,
      child: (
        <>
          <HiOutlineMail size={30} />
        </>
      ),
      href: "mailto:gerardoamayasv2000@gmail.com",
    },
    {
      id: 4,
      child: (
        <>
          <FaInstagram size={30} />
        </>
      ),
      href: "https://www.instagram.com/gerardoamaya_11/",
    },

  ];

  return (
    <div
      name="contact"
      className="bg-gradient-to-b from-black to-gray-800 p-4 text-white w-full h-screen"
    >
      <div className="flex flex-col p-4 justify-center max-w-screen-lg mx-auto w-full h-full">
        <div className="pb-6 pt-14 flex justify-center items-center">
          <p className="text-4xl font-bold inline border-b-4 text-green-500 text-center">
            Contact me !
          </p>
          
        </div>

        <div className=" flex justify-center items-center">
          <form
            action="https://getform.io/f/dfef0a7a-5098-4b88-a127-fa22f3c55852"
            method="POST"
            className=" flex flex-col w-full md:w-1/2"
          >
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="p-2 bg-transparent border-2 rounded-md text-white focus:outline-none"
            />
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              className="my-4 p-2 bg-transparent border-2 rounded-md text-white focus:outline-none"
            />
            <textarea
              name="message"
              placeholder="Enter your message"
              rows="10"
              className="p-2 bg-transparent border-2 rounded-md text-white focus:outline-none"
            ></textarea>

            <button className="text-white bg-gradient-to-b from-cyan-500 to-blue-600 px-6 py-3 my-8 mx-auto flex items-center rounded-full hover:scale-110 duration-300">
              SUBMIT
            </button>
          </form>
        </div>
        <div className="text-green-500 md:h">
          <ul className="flex justify-center items-center ">
            {links.map(({ id, child, href, download }) => (
              <li 
                key={id}
                className={ 
                  "p-2 cursor-pointer inline-flex items-center rounded-full bg-gray-700 mx-1.5 text-xl hover:text-gray-100 hover:bg-green-600 duration-300" 
                }
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  download={download}
                  className="flex justify-between items-center w-full h-full "
                >
                  {child}
                </a>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </div>
    
    
  );
};

export default Contact;