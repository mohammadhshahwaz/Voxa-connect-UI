import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/login";
import Layout from "./layout/Layout";
import CallDemoScreen from "./components/callDemoScreen/CallDemoScreen";
import Home from "./pages/Home/Home";
import Conversation from "./components/conversation/Conversation";
import KnowledgeBase from "./components/knowledgeBase/KnowledgeBase";
import CallDemoOptions from "./components/callDemoOptions/CallDemoOptions";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        {/* All routes with sidebar go inside Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="conversations" element={<Conversation />} />
          <Route path="knowledge" element={<KnowledgeBase />} />
          <Route path="calldemo" element={<CallDemoScreen />} />
          <Route path="calldemooptions" element={<CallDemoOptions />} />
        </Route>

        {/* Optional: 404 page */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
