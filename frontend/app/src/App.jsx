import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import { Login, Register } from "./components/Auth";
import Logout from "./components/Auth/Logout";
import Layout from "./components/shared/Layout";
import Dashboard from "./components/Dashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import BorrowBookDashboard from "./components/BorrowBookDashboard";
import HelpPage from "./components/HelpPage";
import Settings from "./components/Settings";
import { SearchProvider } from "./components/libs/helpers";


function App() {
  return (
    <SearchProvider>
    <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Zoom}
    />
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/home" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/home/customers" element={<EmployeeDashboard />} />
          <Route path="/home/books" element={<BorrowBookDashboard />} />
          <Route path="/home/support" element={<HelpPage />} />
          <Route path="/home/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
    </SearchProvider>
  );
}

export default App;
