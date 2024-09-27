import { useEffect, useState } from "react";
import api from "../api";

const Staff = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    gender: "Male",
    level: 1,
    shifts: 0,
    salary: 0,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const removeEmployee = async (eid) => {
    await api.delete(`/api/employees/${eid}`);
    setEmployees(employees.filter((employee) => employee.employeeCode !== eid));
  };

  const updateEmployee = async (employee) => {
    try {
      console.log("Updating employee:", employee);
      const response = await api.put(
        `/api/employees/${employee.employeeCode}`,
        employee
      );
      setEmployees(
        employees.map((emp) =>
          emp.employeeCode === employee.employeeCode ? response.data : emp
        )
      );
      setErrorMessage(""); // Reset lỗi nếu cập nhật thành công
    } catch (error) {
      setErrorMessage("Update failed. Please try again."); // Hiển thị thông báo lỗi
      console.error("Update failed:", error);
    }
  };

  const resetShiftsAndSalary = async () => {
    try {
      await api.put("/api/employees/reset"); // Gửi yêu cầu reset tới backend
      const updatedEmployees = employees.map((emp) => ({
        ...emp,
        shifts: 0,
        salary: 0,
      }));
      setEmployees(updatedEmployees); // Cập nhật trạng thái với giá trị mới
      setErrorMessage(""); // Reset lỗi nếu thành công
    } catch (error) {
      setErrorMessage("Reset failed. Please try again."); // Hiển thị thông báo lỗi
      console.error("Reset failed:", error);
    }
  };

  const addEmployee = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang
    try {
      // Tạo employeeCode tự động
      const lastEmployeeCode =
        employees.length > 0
          ? employees[employees.length - 1].employeeCode
          : "E0000";
      const newCodeNumber = parseInt(lastEmployeeCode.slice(1)) + 1; // Lấy số sau "E" và tăng lên 1
      const newEmployeeCode = `E${newCodeNumber.toString().padStart(4, "0")}`;

      // Gửi yêu cầu thêm nhân viên mới
      const response = await api.post("/api/employees", {
        ...newEmployee,
        employeeCode: newEmployeeCode,
      });
      setEmployees([...employees, response.data]); // Cập nhật danh sách nhân viên với nhân viên mới
      setShowAddForm(false); // Ẩn form thêm nhân viên
      setNewEmployee({
        name: "",
        gender: "Male",
        level: 1,
        shifts: 0,
        salary: 0,
      }); // Reset form
      setErrorMessage(""); // Reset lỗi nếu thành công
    } catch (error) {
      setErrorMessage("Failed to add employee. Please try again."); // Hiển thị thông báo lỗi
      console.error("Add employee failed:", error);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await api.get("/api/employees");
      setEmployees(response.data);
    };
    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setErrorMessage(""); // Reset lỗi khi bắt đầu chỉnh sửa
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang
    if (selectedEmployee) {
      await updateEmployee(selectedEmployee);
      setSelectedEmployee(null);
    }
  };

  const handleCancel = () => {
    setSelectedEmployee(null);
    setErrorMessage(""); // Reset lỗi khi hủy chỉnh sửa
  };

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
              <th className="px-2 py-3">
                <button
                  onClick={resetShiftsAndSalary}
                  className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-900"
                >
                  Reset Month
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="ml-2 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900"
                >
                  Add Employee
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={`${employee.employeeCode}-${index}`}
              >
                <td className="px-4 py-4">{employee.employeeCode}</td>
                <td className="px-4 py-4">{employee.name}</td>
                <td className="px-4 py-4">{employee.gender}</td>
                <td className="px-4 py-4">{employee.level}</td>
                <td className="px-4 py-4">{employee.shifts}</td>
                <td className="px-4 py-4">VND {employee.salary}</td>
                <td className="px-0 py-4 space-x-3 text-right">
                  <button
                    className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick={() => removeEmployee(employee.employeeCode)}
                  >
                    Remove
                  </button>
                  <button
                    className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900"
                    onClick={() => handleEdit(employee)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {/* Hiển thị thông báo lỗi */}
        {selectedEmployee && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-lg w-full">
              <h2 className="text-lg font-bold">Edit Employee</h2>
              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedEmployee.name}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedEmployee.gender}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        gender: e.target.value,
                      })
                    }
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <select
                    className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedEmployee.level}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        level: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Shifts
                  </label>
                  <input
                    type="number"
                    className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedEmployee.shifts}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        shifts: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <button
                  type="submit" // Đảm bảo đây là một button gửi form
                  className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900"
                >
                  Save
                </button>
                <button
                  type="button" // Đảm bảo đây là một button hủy
                  className="text-gray-700 hover:text-white border border-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-900"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
        {showAddForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-lg w-full">
              <h2 className="text-lg font-bold">Add Employee</h2>
              <form onSubmit={addEmployee}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={newEmployee.gender}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, gender: e.target.value })
                    }
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <select
                    className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={newEmployee.level}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        level: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Shifts
                  </label>
                  <input
                    type="number"
                    className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedEmployee.shifts}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        shifts: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Salary
                  </label>
                  <input
                    type="number"
                    className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={newEmployee.salary}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        salary: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <button
                  type="submit" // Đảm bảo đây là một button gửi form
                  className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900"
                >
                  Add
                </button>
                <button
                  type="button" // Đảm bảo đây là một button hủy
                  className="text-gray-700 hover:text-white border border-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-900"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Staff;
