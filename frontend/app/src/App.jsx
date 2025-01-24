import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register";
import Layout from "./components/shared/Layout";
import Dashboard from "./components/Dashboard";
import Logout from "./components/Auth/Logout";
import BorrowBook from "./components/BorrowBook";
import Employee from "./components/Employee";
//import Books from "./components/Books";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/home" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/home/customers" element={<Employee />} />
          <Route path="/home/books" element={<BorrowBook />} />
          {/*<Route path="/home/books" element={<Books />}/>*/}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
