import { useEffect, useState } from "react";
import api from "../api";

const Staff = () => {
  const [products, setProducts] = useState([]);

  // const removeProduct = async (pid) => {
  //   await api.delete(`/api/employees/${pid}`);
  //   setProducts(products.filter((product) => product.pid !== pid));
  // };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await api.get("/api/employees");
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">EID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Shifts</th>
              <th className="px-4 py-3">Salary</th>
              <th className="px-2 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={`${product.pid}-${index}`} // Sử dụng pid kết hợp với index để tạo khóa duy nhất
              >
                <td className="px-4 py-4">{product.employeeCode}</td>
                <td className="px-4 py-4">{product.name}</td>
                <td className="px-4 py-4">{product.gender}</td>
                <td className="px-4 py-4">{product.level}</td>
                <td className="px-4 py-4">{product.shifts}</td>
                <td className="px-4 py-4">VND {product.salary}</td>
                <td className="px-6 py-4">
                  <button
                    className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    // onClick={() => removeProduct(product.pid)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Staff;
