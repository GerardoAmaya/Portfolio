import React from "react";
import toDoList from "../assets/portfolio/ToDoList.jpg";
import fakecompany from "../assets/portfolio/FakeCompany.jpg";
import blackjack from "../assets/portfolio/BlackJackJS.jpg";
import pokeAPI from "../assets/portfolio/PokeAPI.jpg";
import safeOnSivar from "../assets/portfolio/SafeOnSivar.jpg";

const Portfolio = () => {
  const portfolios = [
    {
      id: 1,
      src: toDoList,
      href: "https://youtu.be/o5-ITXljdaE"
    },
    {
      id: 2,
      src: fakecompany,
      href: "https://youtu.be/Enzz6SRw5-o"
    },
    {
      id: 3,
      src: blackjack,
      href: "https://youtu.be/D_MRWrurFA0"
    },
    {
      id: 4,
      src: pokeAPI,
      href: "https://youtu.be/fHk05FWcLlQ"
    },
    {
      id: 5,
      src: safeOnSivar,
      href: "https://youtu.be/OCd7V5g8RRU"
    },
  ];

  return (
    <div name="portfolio" className="flex justify-center w-full bg-gradient-to-b from-gray-800 to-black text-white pb-20 pt-2">
      <div className="max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-full">
        <div className="pt-20">
          <p className="text-4xl font-bold inline border-b-4 border-white text-green-500">
            Portfolio
          </p>
          <p className="py-6 text-2xl">Projects that I have done</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 px-6 sm:px-0">
          {portfolios.map(({ id, src, href }) => (
            <div key={id} className="flex flex-col items-center shadow-md shadow-gray-600 rounded-lg mb-8">
              <img
                src={src}
                alt=""
                className="rounded-md w-full h-64 object-scale-down"
              />
              <div className="flex items-center justify-center mt-4">
                <button
                  onClick={() => { href ? window.open(href) : alert("No video available") }}
                  className="w-1/2 px-6 py-3 m-4 flex justify-center duration-200 hover:scale-105 bg-blue-600 hover:bg-blue-800 text-white font-bold rounded-full"
                >
                  SEE VIDEO
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
