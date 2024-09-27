import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";
import { ToastContainer } from "react-toastify";

const Home = () => {
  const [employees, setEmployees] = useState([]);
  const [schedule, setSchedule] = useState({}); // Schedule for each day
  const [currentWeek, setCurrentWeek] = useState(0); // Week number
  const [sortedEmployees, setSortedEmployees] = useState([]);
  const [sortOption, setSortOption] = useState({ gender: "", level: "" });
  const [selectedEmployeeSchedule, setSelectedEmployeeSchedule] =
    useState(null);
  const [draggedEmployee, setDraggedEmployee] = useState(null); // Employee being dragged

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await api.get("/api/employees");
      setEmployees(response.data);
      setSortedEmployees(response.data);
    };

    fetchEmployees();

    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
      ((currentDate - startOfYear) / (24 * 60 * 60 * 1000) +
        startOfYear.getDay() +
        1) /
        7
    );
    setCurrentWeek(weekNumber - 1);
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await api.get(`/api/schedule/week/${currentWeek}`);
      setSchedule(response.data.days);
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

  const handleDragStart = (employee) => {
    setDraggedEmployee(employee); // Store dragged employee
  };

  const handleDrop = (day, shift) => {
    if (
      schedule[day]?.[shift]?.some((emp) => emp._id === draggedEmployee._id)
    ) {
      toast.error("Employee already assigned to this shift!");
      return;
    }

    const updatedSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [shift]: [...(schedule[day]?.[shift] || []), draggedEmployee],
      },
    };
    setSchedule(updatedSchedule);

    // Call API to update schedule in database
    api.put("/api/schedule/update", {
      employeeId: draggedEmployee._id,
      day,
      shift,
      week: currentWeek,
    });
  };

  const showEmployeeSchedule = (employee) => {
    const employeeSchedule = Object.keys(schedule).reduce((acc, day) => {
      Object.keys(schedule[day] || {}).forEach((shift) => {
        if (schedule[day][shift]?.some((emp) => emp._id === employee._id)) {
          acc.push(`${day} - ${shift}`);
        }
      });
      return acc;
    }, []);
    setSelectedEmployeeSchedule(employeeSchedule);
  };

  const formatDate = (dayOfWeek) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const diff = dayOfWeek - currentDay;
    const resultDate = new Date(currentDate);
    resultDate.setDate(currentDate.getDate() + diff);
    return resultDate.toLocaleDateString();
  };

  const daysOfWeek = [
    { name: "Monday", index: 1 },
    { name: "Tuesday", index: 2 },
    { name: "Wednesday", index: 3 },
    { name: "Thursday", index: 4 },
    { name: "Friday", index: 5 },
    { name: "Saturday", index: 6 },
    { name: "Sunday", index: 0 },
  ];

  const shifts = ["Ca1", "Ca2", "Ca3"];

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Current Week: {currentWeek}</h2>
      </div>

      <div className="mb-4">
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border">STT</th>
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
                      onDrop={() => handleDrop(day.name, "Ca1")}
                    >
                      {(Array.isArray(schedule[day.name]?.["Ca1"])
                        ? schedule[day.name]["Ca1"]
                        : []
                      ).map((emp) =>
                        emp ? (
                          <div
                            key={emp._id}
                            className="bg-white p-2 mb-2 shadow"
                          >
                            {emp.name}
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
                      onDrop={() => handleDrop(day.name, "Ca2")}
                    >
                      {(Array.isArray(schedule[day.name]?.["Ca2"])
                        ? schedule[day.name]["Ca2"]
                        : []
                      ).map((emp) =>
                        emp ? (
                          <div
                            key={emp._id}
                            className="bg-white p-2 mb-2 shadow"
                          >
                            {emp.name}
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
                      onDrop={() => handleDrop(day.name, "Ca3")}
                    >
                      {(Array.isArray(schedule[day.name]?.["Ca3"])
                        ? schedule[day.name]["Ca3"]
                        : []
                      ).map((emp) =>
                        emp ? (
                          <div
                            key={emp._id}
                            className="bg-white p-2 mb-2 shadow"
                          >
                            {emp.name}
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
  );
};

export default Home;
