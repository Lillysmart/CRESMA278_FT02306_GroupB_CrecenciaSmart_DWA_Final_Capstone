import React, { useState, useEffect } from "react";

export const ShowDetail = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://podcast-api.netlify.app/shows")
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Fetched data:", responseData);
        setData(responseData);
        setLoading(false);
      })
      .catch((fetchError) => {
        console.error("Fetch error:", fetchError);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleNewData = (showId) => {
    fetch(`https://podcast-api.netlify.app/id/${showId}`)
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Fetched data:", responseData);
        setData(responseData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Check if data is present
  const showData = data || [];

  
  return (
    <div className="show-preview-container">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {showData.length > 0 && (
        <div>
          <h1>The Inclusive Prodcast</h1>

          {showData.map((show, showIndex) => (
            <div
              key={showIndex}
              className="show-preview-card"
              onClick={() => handleNewData(show.id)}
            >
              <h2>{show.title}</h2>
              <img src={show.image} alt={`Show ${showIndex + 1}`} />
              <div className="show-preview-details">
                <p>{show.description}</p>
                <h3>Seasons :{show.seasons} </h3>
                {/* Assuming show.updated is a valid Date object */}
                <p>
                  Updated: {new Date(show.updated).toLocaleDateString("en-US")}
                </p>

                <p className="showid"> Id :{show.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
