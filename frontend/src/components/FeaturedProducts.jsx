import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

// Компонент за отделна карта на продукт
const FeaturedProductCard = ({ product }) => {
  const { cart, addToCart } = useCartStore();
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
  const { user } = useUserStore();
  const [isFavorite, setIsFavorite] = useState(favorites.some((item) => item._id === product._id));

  useEffect(() => {
    setIsFavorite(favorites.some((item) => item._id === product._id));
  }, [favorites, product._id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Моля, влезте в профила си, за да добавите продукти в количката", {
        id: "login",
      });
      return;
    }
    if (cart.some((item) => item._id === product._id)) {
      toast.error("Вече сте добавили този продукт в количката!");
      return;
    }
    addToCart(product);
    toast.success("Продуктът е добавен в количката!");
  };

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error("Моля, влезте в профила си, за да добавите продукти в любими", {
        id: "login",
      });
      return;
    }
    if (isFavorite) {
      removeFavorite(product._id);
      toast.success("Продуктът е премахнат от любими!");
    } else {
      addFavorite(product);
      toast.success("Продуктът е добавен в любими!");
    }
  };

  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2">
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30">
        <div className="overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-white">{product.name}</h3>
          <div className="mt-2 mb-5 flex items-center justify-between">
            <p>
              <span className="text-xl font-bold text-emerald-300">${product.price.toFixed(2)}</span>
            </p>
            <button
              className="flex items-center justify-center p-2"
              onClick={handleToggleFavorite}
              aria-label={isFavorite ? "Премахни от любими" : "Добави в любими"}
            >
              <Heart
                className={`h-6 w-6 transition-colors duration-300 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
              />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center"
          >
            Добави в количката
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
  };

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

  return (
    <div className="py-36">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-5xl sm:text-4xl font-bold text-emerald-400 mb-4">
          Специални предложения
        </h2>
        <div className="mt-12">
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
              >
                {featuredProducts?.map((product) => (
                  <FeaturedProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
            <button
              onClick={prevSlide}
              disabled={isStartDisabled}
              className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
                isStartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              disabled={isEndDisabled}
              className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
                isEndDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;