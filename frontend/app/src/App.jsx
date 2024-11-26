import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./Login"
import Register from "./Register";
import Layout from "./components/shared/Layout";
import Dashboard from "./components/Dashboard";
import Books from "./components/Books";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/books" element={<Books />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
