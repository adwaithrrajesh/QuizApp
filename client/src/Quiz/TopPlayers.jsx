import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function TopPlayers() {
  const location = useLocation();
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    fetchTopPlayers();
  }, []);

  const fetchTopPlayers = async () => {
    const quizId = location.state;
    try {
      const response = await axios.post(
        "http://localhost:8080/api/getTop10Players",
        { quizId }
      );
      if (response.data) {
        setTopPlayers(response.data); // Assuming the top players array is in response.data
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Top 10 Players</h1>
      <table className="min-w-full border rounded-lg">
        <thead>
          <tr>
          <th className="bg-gray-200 border text-left px-3 py-2">
              Rank
            </th>
            <th className="bg-gray-200 border text-left px-3 py-2">
              Player Name
            </th>
            <th className="bg-gray-200 border text-left px-3 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {topPlayers &&
            topPlayers.map((player, index) => (
              <tr key={index}>
                <td className="border px-3 py-2">{index+1}</td>
                <td className="border px-3 py-2">{player.playerName}</td>
                <td className="border px-3 py-2">
                  {(player.time / 1000).toFixed(3)} Sec
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopPlayers;
