import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/login";
// import Home from "./pages/Home/Home";
import Layout from "./layout/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Layout />} />

        {/* Optional: 404 page */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
