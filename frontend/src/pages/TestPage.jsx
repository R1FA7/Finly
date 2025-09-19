import { useState } from "react";

const MovieForm = ({ addMovie }) => {
  const [movieData, setMovieData] = useState({ title: "", type: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!movieData.title.trim() || !movieData.type.trim()) return;
    addMovie(movieData);
    setMovieData({ title: "", type: "" });
  };

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setMovieData({ ...movieData, [key]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
      <input
        type="text"
        placeholder="Enter movie name..."
        name="title"
        value={movieData.title}
        onChange={handleChange}
        className="p-2 rounded border-2 border-blue-700 w-full sm:w-1/2
          bg-white text-black dark:bg-gray-700 dark:text-white"
      />
      <select
        name="type"
        value={movieData.type}
        onChange={handleChange}
        className="rounded dark:bg-gray-700 dark:text-white p-2 border border-blue-700"
      >
        <option value="">Select a type</option>
        <option value="sports">Sports</option>
        <option value="movies">Movies</option>
        <option value="series">Series</option>
        <option value="gym">Gym</option>
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Add
      </button>
    </form>
  );
};

const StarRating = ({ rating = 0, onChange, max = 5 }) => {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: max }).map((_, index) => {
        const isActive = index < rating;
        return (
          <button
            key={index}
            onClick={() => onChange(index + 1)}
            type="button"
            className={`text-2xl focus:outline-none ${
              isActive ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

const MovieItem = ({ movie, rateMovie, toggleWatched, deleteMovie }) => {
  const ratingChange = (newRating) => rateMovie(movie.id, newRating);

  return (
    <li className="flex justify-between items-center p-3 rounded-md bg-gray-200 dark:bg-gray-800">
      <span
        className={`${
          movie.watched ? "line-through text-gray-500" : ""
        } font-medium`}
      >
        {movie.title} on {movie.type} {movie.rating && ` - ${movie.rating}/5`}
      </span>
      <div className="flex items-center space-x-2">
        <StarRating rating={movie.rating} onChange={ratingChange} />
        <button
          onClick={() => toggleWatched(movie.id)}
          className="px-2 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
        >
          {movie.watched ? "Unwatch" : "Watched"}
        </button>
        <button
          onClick={() => deleteMovie(movie.id)}
          className="px-2 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Remove
        </button>
      </div>
    </li>
  );
};

const MovieList = ({
  movies,
  rateMovie,
  toggleWatched,
  deleteMovie,
  searchTerm,
  filterStatus,
}) => {
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all"
        ? true
        : filterStatus === "watched"
        ? movie.watched
        : !movie.watched;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mt-5">
      {filteredMovies.length > 0 ? (
        <ul className="space-y-3">
          {filteredMovies.map((movie) => (
            <MovieItem
              key={movie.id}
              movie={movie}
              rateMovie={rateMovie}
              toggleWatched={toggleWatched}
              deleteMovie={deleteMovie}
            />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No movies found.</p>
      )}
    </div>
  );
};

export default function TestPage() {
  const [movies, setMovies] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, watched, unwatched

  const addMovie = ({ title, type }) => {
    const newMovie = {
      id: crypto.randomUUID(),
      title,
      type,
      rating: null,
      watched: false,
    };
    setMovies([...movies, newMovie]);
  };

  const rateMovie = (id, rating) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id ? { ...movie, rating: rating } : movie
      )
    );
  };
  const toggleWatched = (id) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id ? { ...movie, watched: !movie.watched } : movie
      )
    );
  };

  const deleteMovie = (id) => {
    setMovies((prev) => prev.filter((movie) => movie.id !== id));
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors px-4">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">🎬 Movie WatchList</h1>
          <button
            onClick={() => setIsDark(!isDark)}
            className="px-3 py-1 border rounded bg-gray-200 dark:bg-gray-800"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Search movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded border w-full sm:w-auto
              bg-white text-black dark:bg-gray-700 dark:text-white"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All</option>
            <option value="watched">Watched</option>
            <option value="unwatched">Unwatched</option>
          </select>
        </div>

        {/* Form */}
        <MovieForm addMovie={addMovie} />

        {/* List */}
        <MovieList
          movies={movies}
          rateMovie={rateMovie}
          toggleWatched={toggleWatched}
          deleteMovie={deleteMovie}
          searchTerm={searchTerm}
          filterStatus={filterStatus}
        />
      </div>
    </div>
  );
}
