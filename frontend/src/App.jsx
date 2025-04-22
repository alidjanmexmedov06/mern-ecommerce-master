import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import ProfilePage from "./pages/ProfilePage";
import Favorites from "./pages/Favorites";
import Navbar from "./components/Navbar";
import Searchbar from "./components/Searchbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import StorePage from "./pages/StorePage"; // Импортираме StorePage
import ProductDetails from "./pages/ProductDetails";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;

    getCartItems();
  }, [getCartItems, user]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className='min-h-screen bg-black text-white relative overflow-hidden'>
      {/* Background gradient */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute inset-0'></div>
      </div>

      <div className='relative z-50 pt-20'>
        <Navbar />
        {/* Показва Searchbar само на страницата за категории */}
        {location.pathname.startsWith("/category") && (
          <div className='flex justify-center py-4'>
            <Searchbar />
          </div>
        )}
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
          <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
          <Route
            path='/secret-dashboard'
            element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}
          />
          <Route path='/category/:category' element={<CategoryPage />} />
          <Route path='/store' element={<StorePage />} /> {/* Свързваме маршрута с StorePage */}
          <Route path='/products/:id' element={<ProductDetails />} />
          <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
          <Route path='/purchase-success' element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />} />
          <Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
          <Route path='/search/:keyword' element={<HomePage />} />
          <Route path='/profile' element={user ? <ProfilePage /> : <Navigate to='/login' />} />
          <Route path='/favorites' element={user ? <Favorites /> : <Navigate to='/login' />} />
          
        </Routes>
      </div>
      <Toaster 
        toastOptions={{
          duration: 3000
        }}
      />
    </div>
  );
}

export default App;