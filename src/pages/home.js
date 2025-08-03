import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center min-h-screen bg-blue-100 px-4 sm:px-12 relative gap-8 sm:gap-12">
      {/* Logo at top-left corner */}
      <img
        src="/images/logo.png"
        alt="MindSphere Logo"
        className="absolute top-10 left-10 w-24"
      />

      {/* Left Side: Text Content */}
      <div className="flex flex-col p-17 items-start justify-center w-full sm:w-[45%]">
        <h1 className="text-15xl sm:text-5xl font-bold text-black">MindSphere</h1>
        <p className=" font-semibold  pt-20 text-blue-800 mt-3 text-lg">
          MindSphere is an online platform that connects you with professional counselors.  
          Get secure and convenient mental health support.
        </p>
        <button
  className="w-[40%] mt-6 px-4 py-2 bg-blue-500 text-white text-xl sm:text-xl rounded-lg shadow-lg hover:bg-blue-600"
  onClick={() => navigate("/signup")}
>
  Get Started
</button>

      </div>

      {/* Right Side: Image */}
      <div className="w-full sm:w-[40%] flex justify-center">
        <img
          src="/images/home.png"
          alt="Counseling"
          className="w-full max-w-sm object-contain"
        />
      </div>
    </div>
  );
};

export default Home;
