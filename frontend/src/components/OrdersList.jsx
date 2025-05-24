import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);

  // Взимане на поръчките от API
  const fetchOrders = async () => {
    try {
      const response = await axios.get("/auth/orders");
      setOrders(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || `Грешка при зареждане на поръчките: ${error.message}`
      );
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

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {orders.length === 0 ? (
        <p className="text-gray-400 text-3xl text-center">Няма направени поръчки.</p>
      ) : (
        <div className="overflow-x-auto overflow-hidden rounded-2xl">
          <table className="min-w-full border border-gray-700 rounded-2xl bg-gray-800">
            <thead className="bg-gray-900">
              <tr className="text-center text-orange-200 text-balance">
                <th className="p-4 border-b border-gray-700 rounded-tl-2xl">Изображение</th>
                <th className="p-4 border-b border-gray-700">ID на поръчката</th>
                <th className="p-4 border-b border-gray-700">Клиент</th>
                <th className="p-4 border-b border-gray-700">Дата</th>
                <th className="p-4 border-b border-gray-700">Сума</th>
                <th className="p-4 border-b border-gray-700">Плащане</th>
                <th className="p-4 border-b border-gray-700 rounded-tr-2xl">Доставка</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-700">
                  <td className="p-4 text-center">
                    {(() => {
                      const firstWithImage = order.products.find((p) => p.product?.image);
                      return firstWithImage ? (
                        <img
                          src={firstWithImage.product.image}
                          alt={firstWithImage.product.name}
                          className="w-12 h-12 object-cover rounded-xl border border-gray-600 mx-auto"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-600 rounded-xl mx-auto" />
                      );
                    })()}
                  </td>
                  <td className="p-4 text-white text-center">{order._id}</td>
                  <td className="p-4 text-white text-center">{order.user?.name || "X"}</td>
                  <td className="p-4 text-white text-center">
                    {new Date(order.createdAt).toISOString().split("T")[0]}
                  </td>
                  <td className="p-4 text-white text-center">{order.totalAmount.toFixed(2)} лв.</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleUpdatePaidStatus(order._id, order.isPaid)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-xl text-sm mx-auto ${
                        order.isPaid ? "bg-green-600 text-white" : "bg-orange-600 text-white"
                      }`}
                    >
                      {order.isPaid ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {order.isPaid ? "Платено" : "В очакване"}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleUpdateDeliveredStatus(order._id, order.isDelivered)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-xl text-sm mx-auto ${
                        order.isDelivered ? "bg-green-600 text-white" : "bg-orange-600 text-white"
                      }`}
                    >
                      {order.isDelivered ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
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