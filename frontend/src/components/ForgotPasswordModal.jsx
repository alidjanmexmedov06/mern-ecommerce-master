import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader, X } from "lucide-react";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setForgotPasswordMessage("Имейл за възстановяване на парола е изпратен успешно!");
        setForgotEmail("");
      } else {
        setForgotPasswordMessage(data.message || "Грешка при изпращане на имейл.");
      }
    } catch (error) {
      console.error("Error in forgotPassword request:", error);
      setForgotPasswordMessage("Грешка при изпращане на имейл. Моля, опитайте отново.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-gray-900 p-6 rounded-lg shadow-xl sm:w-full sm:max-w-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-300">Забравена парола</h3>
          <button
            onClick={() => {
              onClose();
              setForgotPasswordMessage("");
              setForgotEmail("");
            }}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-300">
              Електронна поща *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="forgot-email"
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
                rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 
                focus:border-emerald-500 sm:text-sm"
                placeholder="Въведете вашия имейл"
              />
            </div>
          </div>

          {forgotPasswordMessage && (
            <p
              className={`text-sm ${
                forgotPasswordMessage.includes("успешно")
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {forgotPasswordMessage}
            </p>
          )}

          <div className="flex justify-between space-x-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                setForgotPasswordMessage("");
                setForgotEmail("");
              }}
              className="w-1/2 py-2 px-4 border border-gray-600 rounded-md text-sm font-medium 
              text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
            >
              Отказ
            </button>
            <button
              type="submit"
              className="w-1/2 py-2 px-4 border border-transparent rounded-md text-sm font-medium 
              text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out 
              disabled:opacity-50"
              disabled={forgotPasswordLoading}
            >
              {forgotPasswordLoading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin inline" aria-hidden="true" />
                  Изпращане...
                </>
              ) : (
                "Изпрати"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordModal;