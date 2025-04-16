import toast from "react-hot-toast";
import { Heart, ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import { useEffect, useState } from "react";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { cart, addToCart } = useCartStore();
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
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
    toast.success(`Продуктът е добавен в количката!`);
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
      toast.success(`Продуктът е премахнат от любими!`);
    } else {
      addFavorite(product);
      toast.success(`Продуктът е добавен в любими!`);
    }
  };

  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full"
          src={product.image || "https://via.placeholder.com/300"}
          alt="product image"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-white">{product.name}</h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-emerald-400">{product.price} лв.</span>
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
          className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={22} className="mr-2" />
          Добави в количката
        </button>
      </div>
    </div>
  );
};

export default ProductCard;