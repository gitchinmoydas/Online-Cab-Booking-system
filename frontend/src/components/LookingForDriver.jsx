import React, { useEffect } from "react";
import { useRef } from "react";
import audio from "./search.mp3";

const LookingForDriver = ({
  pickup,
  destination,
  fare,
  vehicleType,
  setVehicleFound,
}) => {
  const audioRef = useRef(null);

  // useEffect(() => {
  //   // Play the audio when the component mounts
  //   if (audioRef.current) {
  //     audioRef.current.play().catch((err) => {
  //       console.warn("Auto-play prevented:", err);
  //     });
  //   }

  //   return () => {
  //     // Stop the audio when the component unmounts
  //     // if (audioRef.current) {
  //     //   audioRef.current.pause();
  //     //   audioRef.current.currentTime = 0;
  //     // }
  //   };
  // }, []);
  return (
    <div className="relative bg-white rounded-2xl shadow-md p-4 text-gray-800 max-w-md mx-auto">
      {/* Sound */}
      {/* <audio ref={audioRef} >
        <source src={audio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio> */}

      {/* Close Button - now top-right */}
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition z-10"
        onClick={() => setVehicleFound(false)}
      >
        <i className="ri-arrow-down-wide-line text-2xl"></i>
      </button>

      {/* Animated Dots - now near title */}
      <div className="absolute top-3 left-4 flex gap-1">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0s]"></span>
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
      </div>

      {/* Title */}
      <div className="text-center mt-6">
        <h3 className="text-xl font-bold mb-1">Searching for a Driver...</h3>
        <p className="text-sm text-gray-500">
          Please hold on while we connect you
        </p>
      </div>

      {/* Car Image */}
      <div className="flex justify-center mt-4 mb-6">
        <img
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt="Searching Car"
          className="w-32 h-20 object-cover rounded-lg"
        />
      </div>

      {/* Trip Details */}
      <div className="space-y-4 text-sm">
        <div className="flex items-start gap-3 border-b pb-2">
          <i className="ri-map-pin-user-fill text-xl text-indigo-600"></i>
          <div>
            <p className="text-gray-700 font-medium">Pickup Location</p>
            <p className="text-gray-500 line-clamp-1">{pickup}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 border-b pb-2">
          <i className="ri-map-pin-2-fill text-xl text-red-500"></i>
          <div>
            <p className="text-gray-700 font-medium">Destination</p>
            <p className="text-gray-500 line-clamp-1">{destination}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <i className="ri-currency-line text-xl text-green-600"></i>
          <div>
            <p className="text-gray-700 font-medium">Estimated Fare</p>
            <p className="text-gray-500">₹{fare?.[vehicleType]} (Cash)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;
