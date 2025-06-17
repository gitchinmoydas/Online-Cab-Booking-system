// import React, { useState, useEffect, useContext } from 'react';
// import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
// import { SocketContext } from '../context/SocketContext';

// const containerStyle = {
//   width: '100%',
//   height: '100%',
// };

// const defaultCenter = {
//   lat: 0,
//   lng: 0,
// };

// const LiveTracking = () => {
//   const [currentPosition, setCurrentPosition] = useState(defaultCenter);
//   const [onlineCaptains, setOnlineCaptains] = useState([]);
//   const [mapApiLoaded, setMapApiLoaded] = useState(false);
//   const { socket } = useContext(SocketContext);

//   useEffect(() => {
//     const updateLocation = (position) => {
//       const { latitude, longitude } = position.coords;
//       const newLocation = { lat: latitude, lng: longitude };

//       setCurrentPosition(newLocation);

//       const userId = localStorage.getItem('captainId');
//       if (userId && latitude && longitude) {
//         socket?.emit('update-location-captain', {
//           userId,
//           location: {
//             ltd: latitude,
//             lng: longitude,
//           },
//         });
//       }
//     };

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(updateLocation);
//       const watchId = navigator.geolocation.watchPosition(updateLocation);
//       return () => navigator.geolocation.clearWatch(watchId);
//     }
//   }, [socket]);

//   useEffect(() => {
//     if (!socket) return;

//     const handleOnlineCaptains = (captains) => {
//       const validCaptains = captains.filter(
//         (c) =>
//           c.location &&
//           c.location.ltd !== null &&
//           c.location.lng !== null
//       );
//       setOnlineCaptains(validCaptains);
//     };

//     socket.on('online-captains', handleOnlineCaptains);
//     return () => socket.off('online-captains', handleOnlineCaptains);
//   }, [socket]);

//   return (
//     <LoadScript
//       googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
//       onLoad={() => setMapApiLoaded(true)}
//     >
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={currentPosition}
//         zoom={15}
//       >
//         {mapApiLoaded && (
//           <>
//             {/* Current user (captain) marker */}
//             <Marker
//               position={currentPosition}
//               icon={{
//                 url: 'https://images.squarespace-cdn.com/content/v1/6324b1c9fb6a995e4f496a1d/0e367c4f-3298-4c09-b50f-c2977400852f/LPN_Website-Icons_Location.gif?format=2500w',
//                 scaledSize: new window.google.maps.Size(70, 40),
//               }}
//             />

//             {/* Other online captains */}
//             {onlineCaptains.map((captain, index) => (
//               <Marker
//                 key={captain._id || index}
//                 position={{
//                   lat: captain.location.ltd,
//                   lng: captain.location.lng,
//                 }}
//                 icon={{
//                   url: 'https://www.pngall.com/wp-content/uploads/12/Driver-PNG-Picture.png',
//                   scaledSize: new window.google.maps.Size(30, 30),
//                 }}
//               />
//             ))}
//           </>
//         )}
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default LiveTracking;




// import React, { useState, useEffect, useContext } from 'react';
// import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
// import { SocketContext } from '../context/SocketContext';

// const containerStyle = {
//   width: '100%',
//   height: '100%',
// };

// const defaultCenter = {
//   lat: 0,
//   lng: 0,
// };

// const LiveTracking = () => {
//   const [currentPosition, setCurrentPosition] = useState(defaultCenter);
//   const [onlineCaptains, setOnlineCaptains] = useState([]);
//   const [mapApiLoaded, setMapApiLoaded] = useState(false);
//   const { socket } = useContext(SocketContext);
//   const captainId = localStorage.getItem('captainId');
//     const userId = localStorage.getItem('userId');

//   useEffect(() => {
//     const updateLocation = (position) => {
//       const { latitude, longitude } = position.coords;
//       const newLocation = { lat: latitude, lng: longitude };
//       setCurrentPosition(newLocation);



//       if (captainId) {
//         socket?.emit('update-location-captain', {
//           userId: captainId,
//           location: {
//             ltd: latitude,
//             lng: longitude,
//           },
//         });
//       } else if (userId) {
//         socket?.emit('update-location-user', {
//           userId,
//           location: {
//             ltd: latitude,
//             lng: longitude,
//           },
//         });
//       }
//     };

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(updateLocation);
//       const watchId = navigator.geolocation.watchPosition(updateLocation, null, {
//         enableHighAccuracy: true,
//         maximumAge: 0,
//         timeout: 10000,
//       });
//       return () => navigator.geolocation.clearWatch(watchId);
//     }
//   }, [socket]);

//   useEffect(() => {
//     if (!socket) return;

//     const handleOnlineCaptains = (captains) => {
//       const validCaptains = captains.filter(
//         (c) => c.location && c.location.ltd !== null && c.location.lng !== null
//       );
//       setOnlineCaptains(validCaptains);
//     };

//     socket.on('online-captains', handleOnlineCaptains);
//     return () => socket.off('online-captains', handleOnlineCaptains);
//   }, [socket]);

//   return (
//     <LoadScript
//       googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
//       onLoad={() => setMapApiLoaded(true)}
//     >
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={currentPosition}
//         zoom={15}
//       >
//         {mapApiLoaded && (
//           <>
//             {/* Current user/captain marker */}
//             <Marker
//               position={currentPosition}
//               icon={{
//                 url: userId
//                   ? 'https://www.pngall.com/wp-content/uploads/12/Driver-PNG-Picture.png'
//                   : 'https://images.squarespace-cdn.com/content/v1/6324b1c9fb6a995e4f496a1d/0e367c4f-3298-4c09-b50f-c2977400852f/LPN_Website-Icons_Location.gif?format=2500w',

//                 scaledSize: new window.google.maps.Size(60, 50),
//               }}
//             />

//             {/* Online captains (visible for users) */}
//             {onlineCaptains.map((captain, index) => (
//               <Marker
//                 key={captain._id || index}
//                 position={{
//                   lat: captain.location.ltd,
//                   lng: captain.location.lng,
//                 }}
//                 icon={{
//                   url: 'https://www.pngall.com/wp-content/uploads/12/Driver-PNG-Picture.png',
//                   scaledSize: new window.google.maps.Size(30, 30),
//                 }}
//               />
//             ))}
//           </>
//         )}
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default LiveTracking;




import React, { useState, useEffect, useContext } from 'react';
import {
  LoadScript,
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { SocketContext } from '../context/SocketContext';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 0,
  lng: 0,
};

const LiveTracking = ({ pickup, destination }) => {
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [onlineCaptains, setOnlineCaptains] = useState([]);
  const [mapApiLoaded, setMapApiLoaded] = useState(false);
  const [directionsResult, setDirectionsResult] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  const [showRestaurants, setShowRestaurants] = useState(true);

  const { socket } = useContext(SocketContext);
  const captainId = localStorage.getItem('captainId');
  const userId = localStorage.getItem('userId');

  // 👇 Replace these with dynamic values from your app or context
  const pickupLocation = JSON.parse(localStorage.getItem('pickup')) || pickup // Example: Kolkata

  const destinationLocation = JSON.parse(localStorage.getItem('destination')) || destination // Example: Vadodara

  useEffect(() => {
    const updateLocation = (position) => {
      const { latitude, longitude } = position.coords;
      const newLocation = { lat: latitude, lng: longitude };
      setCurrentPosition(newLocation);

      if (captainId) {
        socket?.emit('update-location-captain', {
          userId: captainId,
          location: {
            ltd: latitude,
            lng: longitude,
          },
        });
      } else if (userId) {
        socket?.emit('update-location-user', {
          userId,
          location: {
            ltd: latitude,
            lng: longitude,
          },
        });
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(updateLocation);
      const watchId = navigator.geolocation.watchPosition(updateLocation, null, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      });
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleOnlineCaptains = (captains) => {
      const validCaptains = captains.filter(
        (c) => c.location && c.location.ltd !== null && c.location.lng !== null
      );
      setOnlineCaptains(validCaptains);
    };

    socket.on('online-captains', handleOnlineCaptains);
    return () => socket.off('online-captains', handleOnlineCaptains);
  }, [socket]);

  const fetchNearbyRestaurants = () => {
    if (!window.google || !mapApiLoaded || !currentPosition.lat) return;

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location: currentPosition,
      radius: 2000,
      type: ['restaurant'],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setRestaurants(results);
        setShowRestaurants(true);
      } else {
        console.error('Nearby search failed:', status);
      }
    });
  };


  const handleDirectionsCallback = (response) => {
    if (response?.status === 'OK') {
      setDirectionsResult(response);
    } else {
      console.error('Failed to get directions:', response);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      onLoad={() => setMapApiLoaded(true)}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition}
        zoom={15}
      >
        {mapApiLoaded && (
          <>
            {/* Request route between pickup and destination */}
            {!directionsResult && (
              <DirectionsService
                options={{
                  origin: pickupLocation,
                  destination: destinationLocation,
                  travelMode: window.google.maps.TravelMode.DRIVING,
                }}
                callback={handleDirectionsCallback}
              />
            )}

            {/* Display the route if available */}
            {directionsResult && (
              <DirectionsRenderer
                options={{
                  directions: directionsResult,
                  suppressMarkers: false,
                }}
              />
            )}

            {/* Current user or captain marker */}
            <Marker
              position={currentPosition}
              icon={{
                url: userId
                  ? 'https://www.pngall.com/wp-content/uploads/12/Driver-PNG-Picture.png'
                  : 'https://images.squarespace-cdn.com/content/v1/6324b1c9fb6a995e4f496a1d/0e367c4f-3298-4c09-b50f-c2977400852f/LPN_Website-Icons_Location.gif?format=2500w',
                scaledSize: new window.google.maps.Size(60, 50),
              }}
            />

            {/* Show all online captains (visible to user) */}
            {onlineCaptains.map((captain, index) => (
              <Marker
                key={captain._id || index}
                position={{
                  lat: captain.location.ltd,
                  lng: captain.location.lng,
                }}
                icon={{
                  url: 'https://www.pngall.com/wp-content/uploads/12/Driver-PNG-Picture.png',
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ))}
            {/* showRestaurants && */}

            {
              restaurants.map((place, index) => (
                
                <Marker
                  key={index}
                  position={place.geometry.location}
                  icon={{
                    url: 'https://cdn-icons-png.freepik.com/512/6643/6643359.png',
                    scaledSize: new window.google.maps.Size(35, 35),
                  }}
                  title={place.name}
                />
                
              ))}

          </>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default LiveTracking;

