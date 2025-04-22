import { Link } from "react-router-dom";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import ProductCard from "../components/ProductCard";

const Favorites = () => {
  const { favorites, clearFavorites } = useFavoritesStore();

  return (
    <div className="p-6 pt-20 relative">
      {/* Бутон "Изчисти всички" */}
      {favorites.length > 0 && (
        <div className="absolute top-16 font-bold right-72">
          <button
            onClick={clearFavorites}
            className="px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500"
          >
            Изчисти всички
          </button>
        </div>
      )}

      {/* Центрирано заглавие */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-emerald-400">Любими продукти</h2>
      </div>

      {favorites.length === 0 ? (
        <div className="text-2xl text-gray-400 text-center">
          <p>Нямате харесани продукти.</p>
          <Link
            to="/"
            className="text-2xl text-emerald-400 hover:text-emerald-500 transition duration-300"
          >
            Към начална страница
          </Link>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="w-full max-w-[1400px] px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 justify-items-center">
              {favorites.map((item) => (
                <div key={item._id} className="w-[320px]">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;

