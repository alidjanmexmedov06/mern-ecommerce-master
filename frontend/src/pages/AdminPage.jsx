import { BarChart, PlusCircle, ShoppingBasket, Users, Package } from "lucide-react"; // Добавяме Package иконка за поръчки
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import UsersList from "../components/UsersList";
import OrdersList from "../components/OrdersList"; // Импортираме новия компонент
import { useProductStore } from "../stores/useProductStore";

const tabs = [
  { id: "create", label: "Създаване на продукт", icon: PlusCircle },
  { id: "products", label: "Продукти", icon: ShoppingBasket },
  { id: "analytics", label: "Диаграма", icon: BarChart },
  { id: "users", label: "Клиенти", icon: Users },
  { id: "orders", label: "Поръчки", icon: Package }, // Добавяме нов таб за поръчки
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div className='min-h-screen relative overflow-hidden'>
      <div className='relative z-10 container mx-auto px-4 py-10'>
        <motion.h1
          className='text-4xl font-bold mb-8 text-emerald-400 text-center'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Админ панел
        </motion.h1>

        <div className='flex justify-center mb-8'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <tab.icon className='mr-2 h-5 w-5' />
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "create" && <CreateProductForm />}
        {activeTab === "products" && <ProductsList />}
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "users" && <UsersList />}
        {activeTab === "orders" && <OrdersList />} {/* Добавяме OrdersList */}
      </div>
    </div>
  );
};

export default AdminPage;