import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { BsFillPersonLinesFill } from "react-icons/bs";

const SocialLinks = () => {
  const links = [
    {
      id: 1,
      icon: <FaLinkedin size={30} />,
      href: "https://www.linkedin.com/in/gerardo-alberto-amaya-fuentes-20b292240",
      label: "LinkedIn",
      style: "rounded-tr-md",
    },
    {
      id: 2,
      icon: <FaGithub size={30} />,
      href: "https://github.com/GerardoAmaya",
      label: "GitHub",
    },
    {
      id: 3,
      icon: <HiOutlineMail size={30} />,
      href: "mailto:gerardoamayasv2000@gmail.com",
      label: "Mail",
    },
    {
      id: 4,
      icon: <BsFillPersonLinesFill size={30} />,
      href: "/resume.pdf",
      label: "Resume",
      style: "rounded-br-md",
      download: true,
    },
  ];

  return (
    <div className="hidden lg:flex flex-col fixed top-[35%] left-0">
      <ul>
        {links.map(({ id, icon, href, label, style, download }) => (
          <li
            key={id}
            className={`flex justify-between items-center w-40 h-14 px-4 ml-[-100px] hover:ml-[-10px] hover:rounded-md duration-300 bg-blue-800 text-white ${style}`}
          >
            <a
              href={href}
              className="flex justify-between items-center w-full"
              download={download}
              target="_blank"
              rel="noreferrer"
            >
              {label} {icon}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialLinks;
