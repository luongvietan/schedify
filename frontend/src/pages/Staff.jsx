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

  // Trạng thái cho hộp thoại xác nhận
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [employeeToRemove, setEmployeeToRemove] = useState(null);

  const removeEmployee = async (eid) => {
    await api.delete(`/api/employees/${eid}`);
    setEmployees(employees.filter((employee) => employee.employeeCode !== eid));
  };

  const confirmRemove = () => {
    if (employeeToRemove) {
      removeEmployee(employeeToRemove);
      setEmployeeToRemove(null);
    }
    setShowRemoveConfirm(false);
  };

  const updateEmployee = async (employee) => {
    try {
      const response = await api.put(
        `/api/employees/${employee.employeeCode}`,
        employee
      );
      setEmployees(
        employees.map((emp) =>
          emp.employeeCode === employee.employeeCode ? response.data : emp
        )
      );
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Update failed. Please try again.");
      console.error("Update failed:", error);
    }
  };

  const resetShiftsAndSalary = async () => {
    try {
      await api.put("/api/employees/reset");
      const updatedEmployees = employees.map((emp) => ({
        ...emp,
        shifts: 0,
        salary: 0,
      }));
      setEmployees(updatedEmployees);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Reset failed. Please try again.");
      console.error("Reset failed:", error);
    } finally {
      setShowResetConfirm(false); // Đóng hộp thoại xác nhận sau khi reset
    }
  };

  const addEmployee = async (e) => {
    e.preventDefault();
    try {
      const lastEmployeeCode =
        employees.length > 0
          ? employees[employees.length - 1].employeeCode
          : "E0000";
      const newCodeNumber = parseInt(lastEmployeeCode.slice(1)) + 1;
      const newEmployeeCode = `E${newCodeNumber.toString().padStart(4, "0")}`;

      const response = await api.post("/api/employees", {
        ...newEmployee,
        employeeCode: newEmployeeCode,
      });
      setEmployees([...employees, response.data]);
      setShowAddForm(false);
      setNewEmployee({
        name: "",
        gender: "Male",
        level: 1,
        shifts: 0,
        salary: 0,
      });
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to add employee. Please try again.");
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
    setErrorMessage("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (selectedEmployee) {
      await updateEmployee(selectedEmployee);
      setSelectedEmployee(null);
    }
  };

  const handleCancel = () => {
    setSelectedEmployee(null);
    setErrorMessage("");
  };

  // Hàm format số tiền
  const formatSalary = (salary) => {
    return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  mr-2"
        >
          Add Employee
        </button>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Reset Month
        </button>
      </div>
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
              <th className="px-4 py-3 text-center">Actions</th>{" "}
              {/* Center align Actions header */}
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
                <td className="px-4 py-4">
                  {formatSalary(employee.salary)} VND
                </td>
                <td className="px-4 py-4 text-center">
                  {" "}
                  {/* Center align Actions cell */}
                  <div className="flex justify-center space-x-3">
                    {" "}
                    {/* Center align buttons within cell */}
                    <button
                      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                      onClick={() => handleEdit(employee)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                      onClick={() => {
                        setEmployeeToRemove(employee.employeeCode);
                        setShowRemoveConfirm(true);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {/* Hộp thoại xác nhận Reset Month */}
        {showResetConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-lg w-full">
              <h2 className="text-lg font-bold">Confirm Reset Month</h2>
              <p className="mb-4">
                Are you sure you want to reset the shifts and salary for all
                employees?
              </p>
              <button
                onClick={resetShiftsAndSalary}
                className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                No, Cancel
              </button>
            </div>
          </div>
        )}
        {/* Hộp thoại xác nhận Remove */}
        {showRemoveConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-lg w-full">
              <h2 className="text-lg font-bold">Confirm Remove</h2>
              <p className="mb-4">
                Are you sure you want to remove this employee?
              </p>
              <button
                onClick={confirmRemove}
                className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                No, Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Form thêm nhân viên */}
      {showAddForm && (
        <form
          onSubmit={addEmployee}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-lg w-full">
            <h2 className="text-lg font-bold mb-4">Add Employee</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Name:</label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  required
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Gender:</label>
                <select
                  value={newEmployee.gender}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, gender: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Level:</label>
                <select
                  value={newEmployee.level}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      level: parseInt(e.target.value),
                    })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Shifts:</label>
                <input
                  type="number"
                  value={newEmployee.shifts}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, shifts: e.target.value })
                  }
                  required
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Add Employee
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
      {/* Form chỉnh sửa nhân viên */}
      {selectedEmployee && (
        <form
          onSubmit={handleSave}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-lg w-full">
            <h2 className="text-lg font-bold mb-4">Edit Employee</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Name:</label>
                <input
                  type="text"
                  value={selectedEmployee.name}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      name: e.target.value,
                    })
                  }
                  required
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Gender:</label>
                <select
                  value={selectedEmployee.gender}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      gender: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Level:</label>
                <select
                  value={selectedEmployee.level}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      level: parseInt(e.target.value),
                    })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Shifts:</label>
                <input
                  type="number"
                  value={selectedEmployee.shifts}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      shifts: e.target.value,
                    })
                  }
                  required
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Staff;
