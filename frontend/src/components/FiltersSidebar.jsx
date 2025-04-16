import { useState } from "react";
import { useProductStore } from "../stores/useProductStore";

const FiltersSidebar = () => {
  const { filterByPrice, sortProducts } = useProductStore();
  
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sortOption, setSortOption] = useState("");

  // Обработваме филтрирането по цена
  const handlePriceFilter = () => {
    filterByPrice(minPrice, maxPrice);
  };

  // Нулиране на филтрите
  const handleResetFilters = () => {
    setMinPrice(0);
    setMaxPrice(0);
    setSortOption("");
    filterByPrice(0, 0); // Нулираме ценовия филтър
    sortProducts(""); // Нулираме сортирането
  };

  // Обработваме сортирането
  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    sortProducts(option);
  };

  return (
    <div className="p-4 border border-gray-500 rounded-lg bg-black text-emerald-400">
      <h2 className="text-xl font-semibold mb-4">Филтри</h2>

      {/* Ценови диапазон */}
      <div className="mb-4">
        <label className="block mb-2">Ценови диапазон</label>
        <div className="flex flex-col space-y-2">
          <input
            type="number"
            placeholder="Минимална (лв.)"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="p-2 rounded bg-transparent border border-gray-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Максимална (лв.)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="p-2 rounded bg-transparent border border-gray-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Сортиране */}
      <div className="mb-4">
        <label className="block mb-2">Сортиране по</label>
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="p-2 rounded bg-transparent border border-gray-500 focus:outline-none w-full"
        >
          <option value="" disabled>
            Избери опция
          </option>
          <option value="newest">Най-нови</option>
          <option value="priceLowToHigh">Цена: Ниска към висока</option>
          <option value="priceHighToLow">Цена: Висока към ниска</option>
        </select>
      </div>

      {/* Бутони */}
      <div className="flex flex-col space-y-2">
        <button
          onClick={handlePriceFilter}
          className="bg-emerald-400 text-white px-4 py-2 rounded hover:bg-emerald-500 transition"
        >
          Приложи филтрите
        </button>
        <button
          onClick={handleResetFilters}
          className="bg-transparent border border-gray-500 text-emerald-400 px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Нулирай филтрите
        </button>
      </div>
    </div>
  );
};

export default FiltersSidebar;