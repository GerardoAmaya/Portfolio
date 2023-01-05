import React from "react";

const About = () => {
  return (
    <div
      name="about"
      className="w-full h-screen bg-gradient-to-b from-gray-800 to-black text-white"
    >
      <div className="max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-full">
        <div className="pb-8">
          <p className="text-4xl font-bold inline border-b-4  text-green-500">
            About
          </p>
        </div>

        <p className="text-xl mt-8">
        This page was designed using the technologies of REACT JS with TAILWIND
        </p>

        <br />

        <p className="text-xl ">
        React helps you easily create interactive user interfaces. Design simple views for each state in your app, and React will 
        take care of efficiently updating and rendering the correct components when the data changes.
        </p> <br />
        <p className="text-xl mb-10">
        Tailwind CSS is a CSS framework with predefined classes that you can use to build and style web pages 
        directly in your markup. It allows you to write CSS in your HTML in the form of predefined classes.
        </p>

      </div>
    </div>
  );
};

export default About;