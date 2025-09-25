import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Home from "../pages/Home/Home";
import Conversation from "../components/conversation/Conversation";
import KnowledgeBase from "../components/knowledgeBase/KnowledgeBase";

type PageType = "home" | "conversations" | "knowledge";

const Layout = () => {
  const [activePage, setActivePage] = useState<PageType>("home");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar with fixed width */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main content area with vertical scroll if content is too long */}
      <main className="flex-1 bg-[#efffec] overflow-auto">
        {activePage === "home" && <Home />}
        {activePage === "conversations" && <Conversation />}
        {activePage === "knowledge" && <KnowledgeBase />}
      </main>
    </div>
  );
};

export default Layout;
