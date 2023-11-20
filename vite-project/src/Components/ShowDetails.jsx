import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const ShowDetail = () => {
  const { id } = useParams();
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching show details: ${response.status}`);
        }
        const responseData = await response.json();
        console.log("Fetched show details:", responseData);
        setShowDetails(responseData);
        setLoading(false);
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        setError("Error fetching show details. Please try again later.");
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {showDetails && (
        <div>
          <h1>{showDetails.title}</h1>
          <img src={showDetails.image} alt={showDetails.title} />
          <p>Description: {showDetails.description}</p>
          <p>Seasons: {showDetails.seasons.length}</p>
          {showDetails.seasons.map((season, index) => (
            <div key={index}>
              <h3>{season.title}</h3>
              <p>Number of Episodes: {season.episodes.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
