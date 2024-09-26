import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Signup";
import Income from "./pages/Income";
import Staff from "./pages/Staff";
import Notfound from "./pages/Notfound";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/income" element={<Income />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/*" element={<Notfound />} />
      </Routes>
    </div>
  );
};

export default App;
