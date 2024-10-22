import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Admin } from "./pages/admin/Admin";
import { Login } from "./pages/login/Login";
import { Faculty } from "./pages/faculty/Faculty";
import { Ta } from "./pages/ta/Ta";
import { Student } from "./pages/student/Student";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="admin" element={<Admin />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="student" element={<Student />} />
        <Route path="ta" element={<Ta />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
