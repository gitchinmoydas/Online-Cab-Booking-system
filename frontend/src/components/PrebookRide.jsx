import React, { useState } from 'react';
import axios from 'axios';

const PrebookRide = () => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const scheduledAt = new Date(`${date}T${time}`);

    try {
      const response = await axios.post('http://localhost:4000/rides/prebook', {
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        scheduledAt: scheduledAt.toISOString(),
      });

      if (response.status === 200) {
        setMessage('Prebooking successful!');
      } else {
        setMessage('Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error occurred during prebooking.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-lg rounded-lg border">
      <h2 className="text-xl font-bold mb-4">Prebook a Ride</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Drop-off Location"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Submit Prebooking
        </button>
      </form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default PrebookRide;
