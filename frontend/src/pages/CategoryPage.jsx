import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
  const { fetchProductsByCategory, products } = useProductStore();
  const { category } = useParams();
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [fetchProductsByCategory, category]);


  const filteredProducts = products
    .filter((product) => {
      const price = product.price || 0;
      return !maxPrice || price <= parseFloat(maxPrice) || price === 0;
    })
    .filter((product) => {
      return selectedCategories.length === 0 || selectedCategories.includes(product.category);
    })
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "lowToHigh") return a.price - b.price;
    if (sortOption === "highToLow") return b.price - a.price;
    if (sortOption === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  const handleFilter = () => {
    if (maxPrice && isNaN(parseFloat(maxPrice))) {
      alert("Моля, въведете валидна цена!");
    }
  };

  const handleClearFilter = () => {
    setMaxPrice("");
    setSelectedCategories([]);
    setSortOption("");
    setSearchQuery("");
  };

  

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Filters */}
      <div className="min-w-8 lg:w-1/4 p-4 bg-black order-1 lg:order-none">
        <div className="w-full max-w-xs mx-auto mt-20 lg:mt-36">

          {/* Price */}
          <button
            onClick={handleFilter}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-4 font-bold"
          >
            Филтър по цена
          </button>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 mb-4"
            placeholder="Въведете цена"
          />

          {/* Sorting */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-2">Сортирай по:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="" disabled hidden>Избери</option>
              <option value="newest">Най-нови</option>
              <option value="lowToHigh">Цена: Ниска към висока</option>
              <option value="highToLow">Цена: Висока към ниска</option>
            </select>
          </div>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-2">Търсене на продукт:</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Въведете име на продукт"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Clear filters */}
          <button
            onClick={handleClearFilter}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 focus:outline-none font-bold focus:ring-2 focus:ring-emerald-400"
          >
            Нулирай
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 order-2 lg:order-none px-4 sm:px-6 lg:pl-4 lg:pr-16 py-12">
        <motion.h1
          className="text-center text-3xl font-bold text-emerald-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {sortedProducts?.length || 0}{" "}
          {sortedProducts?.length === 1 ? "продукт" : "продукта"}
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {sortedProducts?.length === 0 ? (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              Не са намерени продукти
            </h2>
          ) : (
            sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPage;



