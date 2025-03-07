import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CityRankings = () => {
  const [cityRankings, setCityRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCityRankings = async () => {
      try {
        const response = await axios.post('http://localhost:3090/api/analysis/cities', { designId: "YOUR_DESIGN_ID_HERE" });
        setCityRankings(response.data.cityRankings);
        setLoading(false);
      } catch (error) {
        setError("Failed to load city rankings.");
        setLoading(false);
      }
    };

    fetchCityRankings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">City-wise Performance Rankings</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border-b p-2">Rank</th>
            <th className="border-b p-2">City</th>
            <th className="border-b p-2">Cooling Cost</th>
            <th className="border-b p-2">Energy Efficiency</th>
          </tr>
        </thead>
        <tbody>
          {cityRankings.map((ranking) => (
            <tr key={ranking.city} className="border-b">
              <td className="p-2">{ranking.rank}</td>
              <td className="p-2">{ranking.city}</td>
              <td className="p-2">{ranking.coolingCost}</td>
              <td className="p-2">{ranking.energyEfficiency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CityRankings;
