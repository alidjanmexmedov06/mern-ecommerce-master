import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false); // Състояние за фокус
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  const clearInput = () => {
    setKeyword("");
  };

  return (
    <form onSubmit={searchHandler} className="flex items-center space-x-2">
      <div className="relative">
        <input
          type="text"
          placeholder="Търсене на продукт..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsFocused(true)} // Задаваме фокус
          onBlur={() => setIsFocused(false)} // Изчистваме фокуса
          className={`px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none pl-10 transition-all w-96`} // Добавен w-72 за по-голяма ширина
        />
        {/* Икона на лупа */}
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M16.5 10.5A6.5 6.5 0 1110 4a6.5 6.5 0 016.5 6.5z"
            />
          </svg>
        </span>
        {/* Хикс за изчистване */}
        {isFocused && ( // Показваме хикса само ако полето е фокусирано
          <span
            onClick={clearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          >
            ✖
          </span>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
      >
        Търсене
      </button>
    </form>
  );
};

export default Search;