import React from 'react';
import bgImage from './assets/vyom.jpg';


const Welcome = () => {
  return (
    <div className="w-screen min-h-screen p-4 flex flex-col items-center justify-start bg-black">
      <h1 className="text-4xl font-bold mt-12 mb-8 text-white">Welcome to Vyom</h1>
      <div
        className="w-full max-w-3xl h-96 bg-contain bg-center  shadow-lg"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
    </div>
  );
};

export default Welcome;