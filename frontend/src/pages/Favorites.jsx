import { Link } from "react-router-dom";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";

const Favorites = () => {
  const { favorites, clearFavorites } = useFavoritesStore();

  return (
    <div className="p-4 sm:p-6 pt-16 sm:pt-20 min-h-screen">
      {/* Header: Centered title + button on right for desktop, stacked for mobile */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="hidden sm:flex sm:flex-1" /> {/* Spacer for desktop */}
        <h2 className="text-3xl sm:text-3xl lg:text-4xl font-bold text-emerald-400 text-center sm:flex-1 mb-4 sm:mb-0">
          Любими продукти
        </h2>
        <div className="flex justify-center sm:justify-start sm:flex-1">
          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="px-4 py-2 sm:px-6 sm:py-2 bg-orange-400 font-bold rounded-md hover:bg-orange-500 transition duration-300 w-full sm:w-auto sm:ml-52 sm:mt-1.5"
            >
              Изтрий всички
            </button>
          )}
        </div>
      </div>

      {/* No favorites case */}
      {favorites.length === 0 ? (
        <div className="text-center text-gray-400">
          <p className="text-lg sm:text-xl lg:text-2xl mb-4">
            Все още нямате харесани продукти.
          </p>
          <Link
            to="/"
            className="text-lg sm:text-xl lg:text-2xl text-emerald-400 hover:text-emerald-500 transition duration-300"
          >
            Към начална страница
          </Link>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="w-full max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10 justify-items-center">
              {favorites.map((item, index) => (
                <motion.div
                  key={item._id}
                  className="w-full max-w-[300px] sm:max-w-[320px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                >
                  <ProductCard product={item} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;




