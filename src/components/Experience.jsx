import React from "react";

import html from "../assets/html.png";
import css from "../assets/css.png";
import javascript from "../assets/javascript.png";
import reactImage from "../assets/react.png";
//import kotlin from "../assets/kotlin.png";
import oracle from "../assets/oracle.png";
import github from "../assets/github.png";
import tailwind from "../assets/tailwind.png";
import sql from "../assets/sql.png";
import docker from "../assets/docker.png";
import mongo from "../assets/mongodb.png";
import vueJS from "../assets/vuejs.png";
import nodeJS from "../assets/nodejs.png";
import laravel from "../assets/laravel.png";
import php from "../assets/php.png";
import python from "../assets/python.png";
import bootstrap from "../assets/bootstrap.png";
import postman from "../assets/postman.png";
//import expressjs from "../assets/expressjs.png";
import swagger from "../assets/swagger.png";


const Experience = () => {
  const techs = [
    { id: 15, src: php, title: "PHP", style: "shadow-blue-600" },
    { id: 14, src: laravel, title: "Laravel", style: "shadow-red-600" },
    { id: 9, src: sql, title: "SQL", style: "shadow-red-800" },
    { id: 7, src: oracle, title: "Oracle", style: "shadow-white" },
    { id: 16, src: python, title: "Python", style: "shadow-yellow-500" },
    { id: 18, src: postman, title: "Postman", style: "shadow-orange-500" },
    { id: 20, src: swagger, title: "Swagger", style: "shadow-green-500" },
    { id: 8, src: github, title: "GitHub", style: "shadow-gray-400" },
    { id: 1, src: html, title: "HTML", style: "shadow-orange-500" },
    { id: 2, src: css, title: "CSS", style: "shadow-blue-500" },
    { id: 3, src: javascript, title: "JavaScript", style: "shadow-yellow-500" },
    { id: 17, src: bootstrap, title: "Bootstrap", style: "shadow-purple-600" },
    { id: 5, src: tailwind, title: "Tailwind", style: "shadow-sky-400" },
    { id: 4, src: reactImage, title: "React", style: "shadow-blue-600" },
    //{ id: 6, src: kotlin, title: "Kotlin", style: "shadow-orange-500" },
    { id: 11, src: mongo, title: "MongoDB", style: "shadow-green-800" },
    { id: 12, src: vueJS, title: "VueJS", style: "shadow-green-500" },
    { id: 13, src: nodeJS, title: "NodeJS", style: "shadow-green-600" },
    //{ id: 19, src: expressjs, title: "ExpressJS", style: "shadow-green-600" },
    { id: 10, src: docker, title: "Docker", style: "shadow-blue-800" }
    ];

  return (
    <div name="experience" className="bg-gradient-to-b from-gray-800 to-black text-white min-h-screen flex items-center">
      <div className="max-w-screen-lg mx-auto p-6 sm:p-12 flex flex-col justify-center">
        <div className="mt-14">
          <p className="text-4xl font-bold inline border-b-4 text-green-500">
            Experience
          </p>
          <p className="py-6 text-2xl">These are the technologies I've worked with</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-24">
          {techs.map(({ id, src, title, style }) => (
            <div
              key={id}
              className={`flex flex-col items-center shadow-md hover:scale-105 duration-500 py-4 rounded-lg ${style} w-32 mx-auto`}
            >
              <img src={src} alt={title} className="w-16 mx-auto" />
              <p className="mt-4 text-center">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
