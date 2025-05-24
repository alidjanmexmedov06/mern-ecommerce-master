import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";
import { User, Mail, Lock, Camera, Edit, ArrowLeft, Check, Eye, EyeOff, Package } from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user, updateUser, loading } = useUserStore();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: user?.password || "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setProfilePicture(user?.profilePicture || null);
    setFormData((prevFormData) => ({
      ...prevFormData,
      name: user?.name || prevFormData.name || "",
      email: user?.email || prevFormData.email || "",
      password: user?.password || prevFormData.password || "",
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  const handleEditOrSave = () => {
    if (isEditing) {
      updateUser({
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
        profilePicture: profilePicture instanceof File ? profilePicture : undefined,
      });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: user?.password || "",
      newPassword: "",
      confirmPassword: "",
    });
    setProfilePicture(user?.profilePicture || null);
    setIsEditing(false);
    setShowPasswordChange(false);
  };

  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword === formData.confirmPassword) {
      if (!formData.name || !formData.email) {
        alert("Името и имейлът не могат да бъдат празни!");
        return;
      }

      updateUser({
        name: formData.name,
        email: formData.email,
        password: formData.newPassword,
      });
      setFormData((prevFormData) => ({
        ...prevFormData,
        newPassword: "",
        confirmPassword: "",
      }));
      setShowPasswordChange(false);
    } else {
      alert("Паролите не съвпадат!");
    }
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">Моят профил</h2>
      </motion.div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className={`flex flex-col md:flex-row ${showPasswordChange ? "gap-6 md:gap-12 md:justify-between" : "md:justify-center"}`}>
          <motion.div
            className="sm:w-full sm:max-w-md mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 relative">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="absolute top-4 left-4 text-emerald-400 hover:text-emerald-300"
                >
                  <ArrowLeft className="h-6 w-6" aria-hidden="true" />
                </button>
              )}

              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {/* Профилна снимка */}
                <div className="flex items-center justify-center gap-4">
                  <div className="relative">
                    {profilePicture ? (
                      <img
                        src={
                          profilePicture instanceof File
                            ? URL.createObjectURL(profilePicture)
                            : profilePicture
                        }
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center border-2 border-gray-500">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {isEditing && (
                      <label
                        htmlFor="profile-picture"
                        className="absolute bottom-0 right-0 bg-emerald-600 p-2 rounded-full cursor-pointer hover:bg-emerald-700"
                      >
                        <Camera className="h-5 w-5 text-white" />
                        <input
                          id="profile-picture"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {isEditing && profilePicture && (
                    <button
                      type="button"
                      onClick={() => setProfilePicture(null)}
                      className="absolute right-[50px] transform -translate-y-1/2 px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition duration-150 ease-in-out"
                      style={{ marginTop: "20px" }}
                    >
                      Изтрий
                    </button>
                  )}
                </div>

                {/* Име */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Име
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                        placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${
                          !isEditing ? "opacity-75" : ""
                        }`}
                      placeholder="Вашето име"
                    />
                  </div>
                </div>

                {/* Имейл */}
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
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={true}
                      className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                        placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm opacity-75"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Бутони "Смени парола" и "Моите поръчки" в един ред */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordChange(true)}
                    className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
                  >
                    <Lock className="mr-2 h-5 w-5" aria-hidden="true" />
                    Смени парола
                  </button>
                  <Link
                    to="/my-orders"
                    className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-emerald-500 transition-colors duration-150 ease-in-out"
                  >
                    <Package className="mr-2 h-5 w-5" aria-hidden="true" />
                    Моите поръчки
                  </Link>
                </div>

                {/* Редактирай профил */}
                <div>
                  <button
                    type="button"
                    onClick={handleEditOrSave}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
                      hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50 leading-none"
                    disabled={loading}
                  >
                    {isEditing ? (
                      <Check className="mr-2 h-5 w-5 translate-y-[1px]" aria-hidden="true" strokeWidth={4} />
                    ) : (
                      <Edit className="mr-2 h-5 w-5 translate-y-[1px]" aria-hidden="true" />
                    )}
                    {isEditing ? "Запази" : "Редактирай"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Смяна на парола */}
          {showPasswordChange && (
            <motion.div
              className="sm:w-full sm:max-w-md mt-12 md:mt-12"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form onSubmit={handlePasswordChangeSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                      Нова парола *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                          placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        placeholder="Въведете новата си парола"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                      Потвърдете паролата *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                          placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        placeholder="Потвърдете новата си парола"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600
                        hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-red-500 transition-colors duration-150 ease-in-out"
                    >
                      ЗАПАЗВАНЕ
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600
                        hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-blue-500 transition-colors duration-150 ease-in-out"
                    >
                      ОТКАЗ
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;