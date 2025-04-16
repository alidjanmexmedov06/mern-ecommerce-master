import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Взимане на поръчките от API
  const fetchOrders = async () => {
    try {
      const response = await axios.get("/auth/orders");
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || `Грешка при зареждане на поръчките: ${error.message}`
      );
      setLoading(false);
    }
  };

  // Промяна на статуса "isPaid"
  const handleUpdatePaidStatus = async (orderId, currentStatus) => {
    try {
      await axios.patch(`/auth/orders/${orderId}/paid`, {
        isPaid: !currentStatus,
      });
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, isPaid: !currentStatus } : order
        )
      );
      toast.success(`Статусът на плащане е ${!currentStatus ? "потвърден" : "отменен"} успешно!`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Грешка при промяна на статуса");
    }
  };

  // Промяна на статуса "isDelivered"
  const handleUpdateDeliveredStatus = async (orderId, currentStatus) => {
    try {
      await axios.patch(`/auth/orders/${orderId}/delivered`, {
        isDelivered: !currentStatus,
      });
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, isDelivered: !currentStatus } : order
        )
      );
      toast.success(`Статусът на доставка е ${!currentStatus ? "потвърден" : "отменен"} успешно!`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Грешка при промяна на статуса");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-white text-center p-6">Зареждане...</p>;
  }

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {orders.length === 0 ? (
        <p className="text-gray-400 text-3xl text-center">Няма направени поръчки.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 rounded-lg bg-gray-800">
            <thead className="bg-gray-900">
              <tr className="text-left text-pink-300 text-sm">
                <th className="p-4 border-b border-gray-700">Изображение</th>
                <th className="p-4 border-b border-gray-700">ID на поръчката</th>
                <th className="p-4 border-b border-gray-700">Клиент</th>
                <th className="p-4 border-b border-gray-700">Дата</th>
                <th className="p-4 border-b border-gray-700">Сума</th>
                <th className="p-4 border-b border-gray-700">Плащане</th>
                <th className="p-4 border-b border-gray-700">Доставка</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-700">
                  <td className="p-4">
                    <div className="flex flex-col space-y-2">
                      {order.products.map((item, index) =>
                        item.product?.image ? (
                          <img
                            key={index}
                            src={item.product.image || "https://via.placeholder.com/50"}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        ) : null
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-white">{order._id}</td>
                  <td className="p-4 text-white">{order.user?.name || "X"}</td>
                  <td className="p-4 text-white">
                    {new Date(order.createdAt).toISOString().split("T")[0]}
                  </td>
                  <td className="p-4 text-white">{order.totalAmount.toFixed(2)} лв.</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleUpdatePaidStatus(order._id, order.isPaid)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.isPaid ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}
                    >
                      {order.isPaid ? "Платено" : "В очакване"}
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleUpdateDeliveredStatus(order._id, order.isDelivered)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.isDelivered ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}
                    >
                      {order.isDelivered ? "Доставено" : "В процес на доставка"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default OrdersList;