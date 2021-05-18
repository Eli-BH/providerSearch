import React, { useState } from "react";
import axios from "axios";
import "./HomePage.css";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const HomePage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [programType, setProgramType] = useState("tv");
  const [watchProviders, setWatchProviders] = useState([]);
  const [searchVisibile, setSearchVisible] = useState(false);
  const [providerVisibile, setProviderVisible] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchText === "") {
      toast.error("Enter query");
      return;
    }

    try {
      if (programType === "tv") {
        const { data } = await axios.post(
          "https://watchproviderserver.herokuapp.com/tvsearch",
          {
            query: searchText,
          }
        );

        console.log(data.results);
        setSearchResults(data.results);
        setSearchVisible(true);
        setProviderVisible(false);
      }

      if (programType === "movie") {
        const { data } = await axios.post(
          "https://watchproviderserver.herokuapp.com/moviesearch",
          {
            query: searchText,
          }
        );

        setSearchResults(data.results);
        setSearchVisible(true);
        setProviderVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProviderSearch = async (id) => {
    await axios
      .get(
        `https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${process.env.REACT_APP_MOVIE_KEY}`
      )
      .then((res) => {
        let streaming;
        if (res.data) streaming = res?.data?.results?.US?.flatrate;
        console.log(streaming);
        if (streaming) {
          setWatchProviders([streaming]);
          setProviderVisible(true);
          setSearchVisible(false);
        }
        if (!streaming) {
          toast.error("No Streaming data");
        }
      })
      .catch((err) => {
        toast.error("no streaming data");
      });
  };

  console.log(watchProviders);
  return (
    <div className="homepage-container">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="header">
        <h1>Where's it streaming?</h1>
      </div>
      <form>
        <input
          className="program-type"
          type="radio"
          id="movie"
          name="program"
          value="movie"
          onChange={(e) => setProgramType(e.target.value)}
        />
        <label for="movie" className="radio-check">
          Movie
        </label>
        <input
          className="program-type"
          type="radio"
          id="tv"
          name="program"
          value="tv"
          onChange={(e) => setProgramType(e.target.value)}
        />
        <label for="tv" className="radio-check">
          Tv
        </label>
      </form>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          value={searchText}
          placeholder="Search here..."
          id="search-input"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button type="submit" id="search-button">
          Search
        </button>
      </form>

      <div className="search-results">
        {searchVisibile &&
          searchResults.map((item, index) => (
            <div
              onClick={() => {
                handleProviderSearch(item.id);
              }}
              key={index}
              className="search-results-item"
            >
              <p>{item.original_name || item.original_title}</p>
            </div>
          ))}
        {providerVisibile && (
          <div className="watch-providers">
            {watchProviders.length > 0 ? (
              watchProviders[0].map((item, index) => (
                <div key={index}>
                  <img
                    src={`https://www.themoviedb.org/t/p/original${item.logo_path}`}
                    alt={item.provider_name}
                    className="watch-provider-image"
                  />
                  <p>{item.provider_name}</p>
                </div>
              ))
            ) : (
              <h1>Not Streaming</h1>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
