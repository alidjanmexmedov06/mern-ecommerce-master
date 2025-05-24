import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { motion } from "framer-motion";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { forgotPassword } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    try {
      await forgotPassword(email);
      setSuccessMessage("Проверете пощата си. Изпратихме връзка за нулиране на паролата на вашия адрес.");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Възникна грешка при изпращане на имейла");
    }
  };

  return (
    <div className="flex flex-col justify-start py-40 sm:px-6 lg:px-8 bg-black min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-gray-800 py-12 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-2xl font-bold text-emerald-500 text-center">Забравена парола</h2>

          <form onSubmit={handleSubmit} className="space-y-8 mt-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Имейл
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
            >
              Изпрати връзка за нулиране
            </button>
          </form>

          {successMessage && (
            <p className="mt-4 text-center text-sm text-gray-300">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="mt-4 text-center text-sm text-red-400">{errorMessage}</p>
          )}

          <p className="mt-8 text-center text-sm text-gray-400">
            Спомняте паролата си?{" "}
            <Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
              Обратно към вход <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
