import { faChevronDown,  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './sidebar.css';

export type PageType = "home" | "conversations" | "knowledge";

interface SidebarProps {
    activePage: PageType;
    setActivePage: (page: PageType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setActivePage, activePage }) => {
    return (
        <aside className="w-64  flex-shrink-0 bg-[#102d0b] text-[#d3ffcd] flex flex-col justify-between">
            {/* Logo */}
            <div className="p-6">
                <img
                    src="/VoxaConnectLogo.png"
                    alt="VoxaConnect logo"
                    className="h-10"
                />
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col justify-center px-4 space-y-2">
                {/* Home */}
                <button
                    onClick={() => setActivePage("home")}
                    className={`flex items-center w-full gap-3 px-4 py-2 rounded-lg transition ${activePage === "home"
                            ? "bg-[#d3ffcd] text-[#102d0b] font-semibold"
                            : "text-[#d3ffcd] hover:bg-[#1a4a14] hover:text-[#d3ffcd]"
                        }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="currentColor"
                    >
                        <path d="M9.875 21.1714H12.6875V16.6C12.6875 16.341 12.7775 16.124 12.9575 15.949C13.1375 15.7741 13.36 15.6863 13.625 15.6857H17.375C17.6406 15.6857 17.8634 15.7735 18.0434 15.949C18.2234 16.1246 18.3131 16.3416 18.3125 16.6V21.1714H21.125V12.9429L15.5 8.82857L9.875 12.9429V21.1714ZM8 21.1714V12.9429C8 12.6533 8.06656 12.379 8.19969 12.12C8.33281 11.861 8.51625 11.6476 8.75 11.48L14.375 7.36571C14.7031 7.1219 15.0781 7 15.5 7C15.9219 7 16.2969 7.1219 16.625 7.36571L22.25 11.48C22.4844 11.6476 22.6681 11.861 22.8012 12.12C22.9344 12.379 23.0006 12.6533 23 12.9429V21.1714C23 21.6743 22.8162 22.1049 22.4487 22.4633C22.0812 22.8217 21.64 23.0006 21.125 23H17.375C17.1094 23 16.8869 22.9122 16.7075 22.7367C16.5281 22.5611 16.4381 22.3441 16.4375 22.0857V17.5143H14.5625V22.0857C14.5625 22.3448 14.4725 22.5621 14.2925 22.7376C14.1125 22.9131 13.89 23.0006 13.625 23H9.875C9.35937 23 8.91812 22.8211 8.55125 22.4633C8.18437 22.1055 8.00062 21.6749 8 21.1714Z" />
                    </svg>
                    Home
                </button>

                {/* Conversations */}
                <button
                    onClick={() => setActivePage("conversations")}
                    className={`flex items-center w-full gap-3 px-4 py-2 rounded-lg transition ${activePage === "conversations"
                            ? "bg-[#d3ffcd] text-[#102d0b] font-semibold"
                            : "text-[#d3ffcd] hover:bg-[#1a4a14] hover:text-[#d3ffcd]"
                        }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="currentColor"
                    >
                        <path d="M17.4 8.6V14.2H9.536L8.6 15.136V8.6H17.4ZM18.2 7H7.8C7.58783 7 7.38434 7.08429 7.23431 7.23431C7.08429 7.38434 7 7.58783 7 7.8V19L10.2 15.8H18.2C18.4122 15.8 18.6157 15.7157 18.7657 15.5657C18.9157 15.4157 19 15.2122 19 15V7.8C19 7.58783 18.9157 7.38434 18.7657 7.23431C18.6157 7.08429 18.4122 7 18.2 7ZM22.2 10.2H20.6V17.4H10.2V19C10.2 19.2122 10.2843 19.4157 10.4343 19.5657C10.5843 19.7157 10.7878 19.8 11 19.8H19.8L23 23V11C23 10.7878 22.9157 10.5843 22.7657 10.4343C22.6157 10.2843 22.4122 10.2 22.2 10.2Z" />
                    </svg>
                    Conversations
                </button>

                {/* Knowledge Base */}
                <button
                    onClick={() => setActivePage("knowledge")}
                    className={`flex items-center w-full gap-3 px-4 py-2 rounded-lg transition ${activePage === "knowledge"
                            ? "bg-[#d3ffcd] text-[#102d0b] font-semibold"
                            : "text-[#d3ffcd] hover:bg-[#1a4a14] hover:text-[#d3ffcd]"
                        }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M8.2 10.6H7M23 10.6H21.8M11.4 13.8H10.6C9.4688 13.8 8.9032 13.8 8.552 13.448C8.2 13.0976 8.2 12.532 8.2 11.4C8.2 10.268 8.2 9.7032 8.552 9.352C8.9024 9 9.468 9 10.6 9H11.4C12.5312 9 13.0968 9 13.448 9.352C13.8 9.7032 13.8 10.2688 13.8 11.4C13.8 12.5312 13.8 13.0968 13.448 13.448C13.0976 13.8 12.532 13.8 11.4 13.8ZM18.6 13.8H19.4C20.5312 13.8 21.0968 13.8 21.448 13.448C21.8 13.0968 21.8 12.5312 21.8 11.4C21.8 10.2688 21.8 9.7032 21.448 9.352C21.0976 9 20.532 9 19.4 9H18.6C17.4688 9 16.9032 9 16.552 9.352C16.2 9.7032 16.2 10.2688 16.2 11.4C16.2 12.5312 16.2 13.0968 16.552 13.448C16.9032 13.8 17.4688 13.8 18.6 13.8Z" />
                        <path d="M16.2 10.6C16.2 10.2818 16.0736 9.97654 15.8485 9.7515C15.6235 9.52645 15.3183 9.40002 15 9.40002C14.6817 9.40002 14.3765 9.52645 14.1515 9.7515C13.9264 9.97654 13.8 10.2818 13.8 10.6" />
                        <path d="M22.2 17H10.2C9.4544 17 9.0816 17 8.788 17.1216C8.59375 17.202 8.41724 17.3199 8.26858 17.4686C8.11992 17.6172 8.00201 17.7937 7.9216 17.988C7.8 18.2816 7.8 18.6544 7.8 19.4C7.8 20.1456 7.8 20.5184 7.9216 20.812C8.00201 21.0063 8.11992 21.1828 8.26858 21.3314C8.41724 21.4801 8.59375 21.598 8.788 21.6784C9.0816 21.8 9.4544 21.8 10.2 21.8H22.2" />
                        <path d="M21.4 21.8C20.516 21.8 19.8 20.7256 19.8 19.4C19.8 18.0744 20.516 17 21.4 17" />
                    </svg>
                    Knowledge Base
                </button>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-green-800">
                <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-[#d3ffcd] text-[#102d0b] font-medium">
                    <div className="flex items-center gap-2">
                        <img
                            src="/elli.png"
                            alt="User Avatar"
                            className="w-8 h-8"
                        />
                        <span className="user-name">Ella Sky</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronDown} />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;