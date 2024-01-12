import React from "react";

const About = () => {
  return (
    <div name="about" className="w-full min-h-screen bg-gradient-to-b from-gray-800 to-black text-white flex items-center">
      <div className="max-w-screen-lg p-8 mx-auto flex flex-col justify-center">
        <div className="pb-8">
          <p className="text-4xl font-bold inline border-b-4 border-green-500">
            About
          </p>
        </div>

        <div className="text-xl mt-8 mb-10">
          <p>
            This page was designed using the technologies of React JS with Tailwind CSS.
          </p>

          <p className="mt-4">
            React helps you easily create interactive user interfaces. Design simple views for each state in your app, and React will 
            take care of efficiently updating and rendering the correct components when the data changes.
          </p>

          <p className="mt-4">
            Tailwind CSS is a CSS framework with predefined classes that you can use to build and style web pages 
            directly in your markup. It allows you to write CSS in your HTML in the form of predefined classes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
