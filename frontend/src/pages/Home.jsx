import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";
import { ToastContainer } from "react-toastify";

const Home = () => {
  const [employees, setEmployees] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [currentWeek, setCurrentWeek] = useState(0);
  const [sortedEmployees, setSortedEmployees] = useState([]);
  const [sortOption, setSortOption] = useState({ gender: "", level: "" });
  const [selectedEmployeeSchedule, setSelectedEmployeeSchedule] =
    useState(null);
  const [draggedEmployee, setDraggedEmployee] = useState(null);
  const [changes, setChanges] = useState([]); // Track changes

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await api.get("/api/employees");
      // console.log("Employees fetched:", response.data);
      setEmployees(response.data);
      setSortedEmployees(response.data);
    };

    fetchEmployees();

    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    // console.log(currentDate, startOfYear);
    const weekNumber = Math.ceil(
      ((currentDate - startOfYear) / (24 * 60 * 60 * 1000) +
        startOfYear.getDay() +
        1) /
        7
    );
    setCurrentWeek(weekNumber);
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await api.get(`/api/schedule/week/${currentWeek}`);
      console.log("Schedule fetched for week", currentWeek, ":", response.data);
      // const scheduleData = response.data.days.reduce((acc, day) => {
      //   acc[day.date] = day.shifts;
      //   return acc;
      // }, {});
      setSchedule(response.data);
    };
    if (currentWeek > 0) {
      fetchSchedule();
    }
  }, [currentWeek]);

  useEffect(() => {
    let sorted = [...employees];

    if (sortOption.gender) {
      sorted = sorted.filter((emp) => emp.gender === sortOption.gender);
    }
    if (sortOption.level) {
      sorted = sorted.filter((emp) => emp.level === parseInt(sortOption.level));
    }
    setSortedEmployees(sorted);
  }, [sortOption, employees]);

  const handleCellClick = (employee, day, shift) => {
    if (
      schedule.days?.[day.index]?.shifts?.[shift]?.some(
        (emp) => emp._id === employee._id
      )
    ) {
      toast.error("Employee already assigned to this shift!");
      return;
    }
    const updatedSchedule = {
      ...schedule,
      days: schedule.days.map((d, i) =>
        i === day.index
          ? {
              ...d,
              shifts: {
                ...d.shifts,
                [shift]: [...(d.shifts[shift] || []), employee.employeeCode],
              },
            }
          : d
      ),
    };
    console.log("Updated schedule:", updatedSchedule);
    setSchedule(updatedSchedule);
    setChanges([
      ...changes,
      { employeeId: employee._id, day: day.name, shift },
    ]);
  };

  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const formatDate = (dayOfWeek) => {
    const currentDate = new Date();
    const startOfWeek = getStartOfWeek(currentDate);
    const resultDate = new Date(startOfWeek);
    resultDate.setDate(startOfWeek.getDate() + dayOfWeek);
    return resultDate.toLocaleDateString("en-GB");
  };

  const saveChanges = async () => {
    if (window.confirm("Are you sure you want to save the changes?")) {
      try {
        await Promise.all(
          changes.map((change) =>
            api.put("/api/schedule/update", {
              employeeId: change.employeeId,
              day: change.day,
              shift: change.shift,
              week: currentWeek,
            })
          )
        );
        toast.success("Changes have been saved successfully!");
        console.log(`Save changed schedule : `, schedule);
        setChanges([]);
      } catch (error) {
        console.error("Error saving changes:", error); // Thêm dòng này để log lỗi
        toast.error("An error occurred while saving changes!");
      }
    }
  };

  const daysOfWeek = [
    { name: "Monday", index: 0 },
    { name: "Tuesday", index: 1 },
    { name: "Wednesday", index: 2 },
    { name: "Thursday", index: 3 },
    { name: "Friday", index: 4 },
    { name: "Saturday", index: 5 },
    { name: "Sunday", index: 6 },
  ];

  const shifts = ["Shift 1", "Shift 2", "Shift 3"];

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Current Week: {currentWeek}</h2>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div>
            <select
              onChange={(e) =>
                setSortOption({ ...sortOption, gender: e.target.value })
              }
              className="border p-2 mr-2"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select
              onChange={(e) =>
                setSortOption({ ...sortOption, level: e.target.value })
              }
              className="border p-2"
            >
              <option value="">All Levels</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
            </select>
          </div>

          <button
            onClick={saveChanges}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Save Changes
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border">No</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-6 border">Shift</th>
                {daysOfWeek.map((day) => (
                  <th key={day.name} className="py-2 px-4 border">
                    {day.name} - {formatDate(day.index)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedEmployees.map((employee, index) => (
                <React.Fragment key={employee._id}>
                  <tr>
                    <td className="py-2 px-4 border" rowSpan="3">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border" rowSpan="3">
                      {employee.name}
                    </td>
                    <td className="py-2 px-4 border">Shift 1</td>
                    {daysOfWeek.map((day) => (
                      <td
                        key={day.name}
                        className="py-2 px-4 border"
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => handleCellClick(employee, day, "Ca1")}
                      >
                        {(Array.isArray(
                          schedule.days?.[day.index]?.shifts?.["Ca1"]
                        )
                          ? schedule.days[day.index].shifts["Ca1"]
                          : []
                        ).map((emp) =>
                          employees.find((e) => e._id === emp._id) ? (
                            <div
                              key={emp._id}
                              className="bg-white p-2 mb-2 shadow"
                            >
                              {employees.find((e) => e._id === emp._id).name}
                            </div>
                          ) : null
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border">Shift 2</td>
                    {daysOfWeek.map((day) => (
                      <td
                        key={day.name}
                        className="py-2 px-4 border"
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => handleCellClick(employee, day, "Ca2")}
                      >
                        {(Array.isArray(
                          schedule.days?.[day.index]?.shifts?.["Ca2"]
                        )
                          ? schedule.days[day.index].shifts["Ca2"]
                          : []
                        ).map((emp) =>
                          employees.find((e) => e._id === emp._id) ? (
                            <div
                              key={emp._id}
                              className="bg-white p-2 mb-2 shadow"
                            >
                              {employees.find((e) => e._id === emp._id).name}
                            </div>
                          ) : null
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border">Shift 3</td>
                    {daysOfWeek.map((day) => (
                      <td
                        key={day.name}
                        className="py-2 px-4 border"
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => handleCellClick(employee, day, "Ca3")}
                      >
                        {(Array.isArray(
                          schedule.days?.[day.index]?.shifts?.["Ca3"]
                        )
                          ? schedule.days[day.index].shifts["Ca3"]
                          : []
                        ).map((emp) =>
                          employees.find((e) => e._id === emp._id) ? (
                            <div
                              key={emp._id}
                              className="bg-white p-2 mb-2 shadow"
                            >
                              {employees.find((e) => e._id === emp._id).name}
                            </div>
                          ) : null
                        )}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {selectedEmployeeSchedule && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">
              Schedule for Selected Employee:
            </h2>
            <ul>
              {selectedEmployeeSchedule.map((day) => (
                <li key={day}>{day}</li>
              ))}
            </ul>
          </div>
        )}

        <ToastContainer />
      </div>
    </>
  );
};

export default Home;
