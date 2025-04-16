import { useEffect, useCallback, useState } from "react";
import { Trash2 } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, getAllUsers, deleteUser, makeUserAdmin } = useUserStore();
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Грешка при извличане на потребители");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [getAllUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Проверяваме дали потребителят е администратор, ако не е, го пренасочваме
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Нямате права да достъпите тази страница!");
      navigate("/");
    }
  }, [user, navigate]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Сигурен ли си, че искаш да изтриеш този потребител?")) return;
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Грешка при изтриване на потребител");
      console.error("Error deleting user:", err);
    }
  };

  const handleMakeAdmin = async (userId) => {
    if (!window.confirm("Сигурен ли си, че искаш да направиш този потребител администратор? Вие ще загубите администраторските си права.")) return;
    try {
      const updatedUsers = await makeUserAdmin(userId);
      setUsers(updatedUsers);
      setError(null);

      // Проверяваме дали текущият потребител (Иван) вече не е администратор
      if (user._id !== userId && user.role !== "admin") {
        toast.success("Вече не сте администратор. Ще бъдете пренасочени.");
        setTimeout(() => navigate("/"), 2000); // Даваме време на потребителя да види съобщението
      }
    } catch (err) {
      setError(err.response?.data?.message || "Грешка при промяна на ролята");
      console.error("Error making user admin:", err);
    }
  };

  if (loading) return <div className="text-center text-gray-700">Зареждане...</div>;
  if (error) return <div className="text-center text-red-500">Грешка: {error}</div>;

  return (
    <motion.div
      className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto mt-12'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className='min-w-full divide-y divide-gray-700'>
        <thead className='bg-gray-700'>
          <tr>
            <th
              scope='col'
              className='px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider border-r border-gray-700'
            >
              ID
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider border-r border-gray-700'
            >
              Име
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider border-r border-gray-700'
            >
              Имейл
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider border-r border-gray-700'
            >
              Админ
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider border-r border-gray-700'
            >
              Действия
            </th>
          </tr>
        </thead>

        <tbody className='bg-gray-800 divide-y divide-gray-700'>
          {users?.map((u) => (
            <tr key={u._id} className='hover:bg-gray-700'>
              <td className='px-6 py-4 whitespace-nowrap border-r border-gray-700'>
                <div className='text-sm font-medium text-gray-300 text-center'>{u._id}</div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap border-r border-gray-700'>
                <div className='text-sm text-gray-300 text-center'>{u.name}</div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap border-r border-gray-700'>
                <div className='text-sm text-gray-300 text-center'>{u.email}</div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap border-r border-gray-700'>
                <div className='flex justify-center'>
                  <button
                    onClick={() => handleMakeAdmin(u._id)}
                    className='p-1 rounded-full bg-orange-200 hover:bg-orange-300 transition-colors duration-200'
                    disabled={u.role === "admin" || u._id === user._id}
                  >
                    <span
                      className={
                        u.role === "admin" ? "text-gray-900" : "text-red-500"
                      }
                    >
                      {u.role === "admin" ? "✔" : "✖"}
                    </span>
                  </button>
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap border-r border-gray-700 text-sm font-medium'>
                <div className='flex justify-center'>
                  {u.role !== "admin" && u._id !== user._id && (
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className='text-red-400 hover:text-red-300'
                    >
                      <Trash2 className='h-5 w-5' />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <p className="text-gray-300 text-center py-4">Няма регистрирани потребители.</p>
      )}
    </motion.div>
  );
};

export default UsersList;