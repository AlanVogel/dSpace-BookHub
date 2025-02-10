import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register";
import Layout from "./components/shared/Layout";
import Dashboard from "./components/Dashboard";
import Logout from "./components/Auth/Logout";
import EmployeeDashboard from "./components/EmployeeDashboard";
import BorrowBookDashboard from "./components/BorrowBookDashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/home" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/home/customers" element={<EmployeeDashboard />} />
          <Route path="/home/books" element={<BorrowBookDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
