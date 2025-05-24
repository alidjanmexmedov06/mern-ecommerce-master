import { useState } from "react";
import { useParams } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { motion } from "framer-motion";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();

  const { resetPassword } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Паролите не съвпадат. Моля, опитайте отново.");
      return;
    }

    try {
      await resetPassword(token, password);
      setSuccessMessage("Паролата ви беше успешно нулирана! Можете да влезете с новата си парола.");
      console.log("Успешно нулиране на парола");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Възникна грешка при нулиране на паролата");
      console.log("Грешка при нулиране:", err);
    }
  };

  return (
    <div className="flex flex-col justify-start py-36 sm:px-6 lg:px-8 bg-black min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="sm:mx-auto sm:w-full sm:max-w-lg"
      >
        <div className="bg-gray-800 py-10 px-6 shadow sm:rounded-lg sm:px-12">
          <h2 className="text-2xl font-bold text-emerald-500 text-center">Нулиране на парола</h2>

          <form onSubmit={handleSubmit} className="space-y-8 mt-8">
            <div>
              <label htmlFor="password" className="block text-base font-medium text-gray-300">
                Нова парола
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Въведете новата си парола"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 pl-12 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-base"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6 text-emerald-500" aria-hidden="true" />
                  ) : (
                    <Eye className="h-6 w-6 text-emerald-500" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-base font-medium text-gray-300">
                Потвърдете новата парола
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Потвърдете новата си парола"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full px-4 py-3 pl-12 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-base"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-6 w-6 text-emerald-500" aria-hidden="true" />
                  ) : (
                    <Eye className="h-6 w-6 text-emerald-500" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
            >
              Запазване
            </button>
          </form>

          {successMessage && (
            <p className="mt-6 text-center text-sm text-gray-300">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="mt-6 text-center text-sm text-red-400">{errorMessage}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ResetPassword;