import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFavoritesContext } from "./FavoritesContext";



export const ShowPreview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [titleSearchTerm, setTitleSearchTerm] = useState("");
  const [genreSearchTerm, setGenreSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("all"); // Default to "all"
  const { favorites } = useFavoritesContext();
  const [selectedGenre, setSelectedGenre] = useState();
  const navigate = useNavigate();

  // Genre mapping
  const genreMap = {
    1: "Personal Growth",
    2: "True Crime and Investigative Journalism",
    3: "History",
    4: "Comedy",
    5: "Entertainment",
    6: "Business",
    7: "Fiction",
    8: "News",
    9: "Kids and Family",
  };

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

  const handleGenreChange = (e) => {
    setGenreSearchTerm(e.target.value);
    setSelectedGenre(e.target.value);
  };

  const showData = data || [];

  const handleTitleSearch = () => {
    const titleSearchTermLower = titleSearchTerm.toLowerCase();
    const filteredResults = showData.filter((show) => {
      const titleLower = show.title.toLowerCase();
      return titleLower.includes(titleSearchTermLower);
    });
    return filteredResults;
  };

  const handleGenreSearch = () => {
    const genreSearchTermLower = genreSearchTerm.toLowerCase();
    const filteredResults = showData.filter((show) => {
      const genreLower = (show.genres || [])
        .map((id) => genreMap[id])
        .join(", ")
        .toLowerCase();
      return genreLower.includes(genreSearchTermLower);
    });
    return filteredResults;
  };

  const handleShowClick = (showId) => {
    navigate(`/id/${showId}`);
  };

  const handleFavoriteClick = () => {
    navigate("/favourites");
  };

  const sortFunctions = {
    titleAsc: (a, b) => {
      const titleA = (a.title || "").toLowerCase();
      const titleB = (b.title || "").toLowerCase();
      return titleA.localeCompare(titleB);
    },
    titleDesc: (a, b) => {
      const titleA = (a.title || "").toLowerCase();
      const titleB = (b.title || "").toLowerCase();
      return titleB.localeCompare(titleA);
    },
    dateAsc: (a, b) => new Date(a.updated) - new Date(b.updated),
    dateDesc: (a, b) => new Date(b.updated) - new Date(a.updated),
  };
  

  let sortedData;
  if (sortOption === "all") {
    // Use unsorted data
    sortedData = showData;
  } else {
    // Use sorted data based on the selected option
    sortedData = [...showData].sort(sortFunctions[sortOption]);
  }

  return (
    <>
      <div className="show-preview-container">
        <div className="top-buttons">
          <label>Sort By:</label>
          <select
            className="sort-dropdown"
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
          >
            <option value="all">All</option>
            <option value="titleAsc">Title A-Z</option>
            <option value="titleDesc">Title Z-A</option>
            <option value="dateAsc">Oldest</option>
            <option value="dateDesc">Latest</option>
          </select>
          <label>Title:</label>
          <input
            className="title-button"
            type="search"
            placeholder="Search by title..."
            value={titleSearchTerm}
            onChange={(e) => setTitleSearchTerm(e.target.value)}
          />
          <label>Genre:</label>
          <select
            className="title-button"
            value={selectedGenre}
            onChange={handleGenreChange}
          >
            <option value="">All Genres</option>
            {Object.values(genreMap).map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <button className="favourite-button" onClick={handleFavoriteClick}>
            View Favorites
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        <div className="show-grid">
          {sortedData
            .filter(
              (show) =>
                (!selectedGenre ||
                  (show.genres &&
                    show.genres
                      .map((id) => genreMap[id])
                      .includes(selectedGenre))) &&
                show.title.toLowerCase().includes(titleSearchTerm.toLowerCase())
            )
            .map((show, showIndex) => (
              <div
                key={showIndex}
                className="show-preview-card"
                onClick={() => handleShowClick(show.id)}
              >
                <h2>{show.title}</h2>
                <img src={show.image} alt={`Show ${showIndex + 1}`} />
                <p>{show.description}</p>
                <h3>Seasons: {show.seasons} </h3>
                <p>
                  Updated: {new Date(show.updated).toLocaleDateString("en-UK")}
                </p>
                <p className="showgenre">
                  Genre:{" "}
                  {show.genres
                    ? show.genres.map((id) => genreMap[id]).join(", ")
                    : "N/A"}
                </p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};