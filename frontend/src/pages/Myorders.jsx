import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { user } = useUserStore();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchUserOrders = async () => {
    try {
      const response = await axios.get("/auth/my-orders"); // <- правилният път!
      setOrders(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Грешка при зареждане на поръчките: ${error.message}`
      );
    }
  };

  fetchUserOrders();
}, [user]);

  return (
    <motion.div
      className="p-6 bg-black min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="max-w-6xl mx-auto mt-16">
        <h1 className="text-4xl text-orange-200 font-bold mb-16 text-center">
          Моите поръчки
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-400 text-2xl text-center">
            Няма направени поръчки.
          </p>
        ) : (
          <div className="overflow-x-auto overflow-hidden rounded-2xl">
            <table className="min-w-full text-base border border-gray-700 rounded-2xl bg-gray-800">
              <thead className="bg-gray-900">
                <tr className="text-center text-orange-200">
                  <th className="p-6 border-b border-gray-700 rounded-tl-2xl">
                    Изображение
                  </th>
                  <th className="p-6 border-b border-gray-700">ID на поръчката</th>
                  <th className="p-6 border-b border-gray-700">Дата</th>
                  <th className="p-6 border-b border-gray-700">Сума</th>
                  <th className="p-6 border-b border-gray-700">Статус</th>
                  <th className="p-6 border-b border-gray-700 rounded-tr-2xl">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-700">
                    <td className="p-6 text-center">
                      {(() => {
                        const firstWithImage = order.products.find(
                          (p) => p.product?.image
                        );
                        return firstWithImage ? (
                          <img
                            src={firstWithImage.product.image}
                            alt={firstWithImage.product.name}
                            className="w-14 h-14 object-cover rounded-xl border border-gray-600 mx-auto"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-600 rounded-xl mx-auto" />
                        );
                      })()}
                    </td>
                    <td className="p-6 text-white text-center">{order._id}</td>
                    <td className="p-6 text-white text-center">
                      {new Date(order.createdAt).toISOString().split("T")[0]}
                    </td>
                    <td className="p-6 text-white text-center">
                      {order.totalAmount.toFixed(2)} лв.
                    </td>
                    <td className="p-6 text-center">
                      <span
                        className={`px-4 py-2 rounded-xl text-sm ${
                          order.isDelivered
                            ? "bg-green-600 text-white"
                            : order.isPaid
                            ? "bg-yellow-600 text-white"
                            : "bg-orange-600 text-white"
                        }`}
                      >
                        {order.isDelivered
                          ? "Доставена"
                          : order.isPaid
                          ? "Изпратена"
                          : "Обработка"}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-white hover:text-emerald-300 text-sm"
                      >
                        Виж детайли
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Бутон към профила, без стрелка */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/profile")}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl transition w-1/2"
          >
            Към профила
          </button>
        </div>
      </div>

      {/* МОДАЛ */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Само тук обвивам детайлите с motion.div за анимация */}
            <motion.div
              className="bg-gray-900 text-white p-8 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4 text-center">Детайли на поръчката</h2>
              <ul className="space-y-4">
                {selectedOrder.products.map((item, i) => (
                  <li key={i} className="flex items-center gap-4 border-b pb-4">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-700"
                    />
                    <div>
                      <p className="font-semibold">{item.product?.name}</p>
                      <p>Количество: {item.quantity}</p>
                      <p>Цена: {item.price.toFixed(2)} лв.</p>
                      <p className="text-sm text-gray-400">
                        Общо: {(item.quantity * item.price).toFixed(2)} лв.
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-emerald-600 rounded-xl hover:bg-emerald-500 transition"
                >
                  Затвори
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyOrders;




