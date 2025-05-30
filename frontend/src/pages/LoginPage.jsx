import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState(""); // Състояние за имейл
  const [password, setPassword] = useState(""); // Състояние за парола
  const [rememberMe, setRememberMe] = useState(false); // Състояние за "Запомни ме"
  const [showPassword, setShowPassword] = useState(false); // Състояние за показване/скриване на паролата

  const { login, loading } = useUserStore(); // Извличане на login функцията и състоянието за зареждане от useUserStore

  // Зареждане на запазени имейл и парола от localStorage при първоначално зареждане
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail) {
      setEmail(savedEmail);
    }
    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  // Обработка на изпращането на формата
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    login(email, password); // Извикване на login функцията от useUserStore

    // Запазване или премахване на данни в localStorage в зависимост от "Запомни ме"
    if (rememberMe) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Заглавие с анимация */}
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-500">Вход</h2>
      </motion.div>

      {/* Форма за вход с анимация */}
      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Поле за имейл */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Електронна поща
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
                  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 
                  focus:border-emerald-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Поле за парола */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Парола
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
                  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500
                  focus:border-emerald-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Опции за "Запомни ме" и "Забравена парола" */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 accent-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Запомни ме
                </label>
              </div>

              {/* Линк към страницата за забравена парола */}
              <Link to="/forgot-password" className="text-sm text-gray-300 hover:text-emerald-300">
                Забравена парола?
              </Link>
            </div>

            {/* Бутон за вход */}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent 
              rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
              hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                  Зареждане...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                  Вход
                </>
              )}
            </button>
          </form>

          {/* Линк за регистрация */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Нямаш акаунт?{" "}
            <Link to="/signup" className="font-medium text-emerald-400 hover:text-emerald-300">
              Регистрация <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;