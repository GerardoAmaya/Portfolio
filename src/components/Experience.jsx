import React from "react";

import html from "../assets/html.png";
import css from "../assets/css.png";
import javascript from "../assets/javascript.png";
import reactImage from "../assets/react.png";
import kotlin from "../assets/kotlin.png";
import oracle from "../assets/oracle.png";
import github from "../assets/github.png";
import tailwind from "../assets/tailwind.png";
import sql from "../assets/sql.png";
import docker from "../assets/docker.png";
import mongo from "../assets/mongodb.png";
import csharp from "../assets/csharp.png";

const Experience = () => {
  const techs = [
    {
      id: 1,
      src: html,
      title: "HTML",
      style: "shadow-orange-500",
    },
    {
      id: 2,
      src: css,
      title: "CSS",
      style: "shadow-blue-500",
    },
    {
      id: 3,
      src: javascript,
      title: "JavaScript",
      style: "shadow-yellow-500",
    },
    {
      id: 4,
      src: reactImage,
      title: "React",
      style: "shadow-blue-600",
    },
    {
      id: 5,
      src: tailwind,
      title: "Tailwind",
      style: "shadow-sky-400",
    },
    {
      id: 6,
      src: kotlin,
      title: "Kotlin",
      style: "shadow-orange-500",
    },
    {
      id: 7,
      src: oracle,
      title: "Oracle",
      style: "shadow-white",
    },
    {
      id: 8,
      src: github,
      title: "GitHub",
      style: "shadow-gray-400",
    },
    {
      id: 9,
      src: sql,
      title: "SQL",
      style: "shadow-red-800",
    },
    {
        id: 10,
        src: docker,
        title: "Docker",
        style: "shadow-blue-800",
        },
    {
        id: 11,
        src: mongo,
        title: "MongoDB",
        style: "shadow-green-800",
        },
    {
        id: 12,
        src: csharp,
        title: "C#",
        style: "shadow-purple-800",
        },
  ];

  return (
    <div
      name="experience"
      className="w-full h-screen bg-gradient-to-b from-gray-800 to-black text-white"
    >
      <div className="max-w-screen-lg mx-auto p-2 flex flex-col justify-center w-full h-full text-white">
        <div>
        <p className="pt-4">
            <span className="text-4xl font-bold inline border-b-4 text-green-500">
                Experience
            </span>
        </p>
          <p className="py-6 text-2xl">These are the technologies I've worked with</p>
        </div>

        <div className="w-full grid grid-cols-3 sm:grid-cols-4 gap-6 text-center  px-12 sm:px-0">
          {techs.map(({ id, src, title, style }) => (
            <div
              key={id}
              className={`shadow-md hover:scale-105 duration-500 py-2 rounded-lg ${style}`}
            >
              <img src={src} alt="" className="w-16 mx-auto" />
              <p className="mt-4">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;