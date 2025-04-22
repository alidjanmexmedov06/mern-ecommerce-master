import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError("Грешка при зареждане на продукта");
        setLoading(false);
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center text-emerald-400 mt-10">Зареждане...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!product) {
    return <div className="text-center text-gray-400 mt-10">Продуктът не е намерен</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="flex flex-col md:flex-row gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Изображение на продукта */}
          <div className="flex-1">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-sm mx-auto rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Детайли за продукта */}
          <div className="flex-1 text-white">
            <h1 className="text-3xl font-bold text-emerald-400 mb-4">{product.name}</h1>
            <p className="text-2xl text-gray-300 mb-4">{product.price} лв.</p>
            <div className="mb-4">
              <span className="text-gray-300 font-semibold">Категория: </span>
              <span className="text-emerald-400">{product.category}</span>
            </div>
            <p className="text-gray-400 mb-6">{product.description}</p>
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition">
              Добави в количката
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;