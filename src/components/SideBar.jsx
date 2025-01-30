import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import logo from "../assets/images/GenesisOfficialLogo.png";
import {
    FaInfoCircle,
    FaBook,
    FaHome,
    FaRegFileAlt,
    FaFileAlt,
    FaPenAlt,
    FaBriefcase,
    FaDownload,
} from "react-icons/fa";
import PropTypes from "prop-types";

const SideBar = (props) => {
    const [activeItem, setActiveItem] = useState("");
    const navigate = useNavigate();

    const menuItems = [
        {id: 3, name: "Home", icon: <FaHome/>, route: "/"},
        {id: 1, name: "About Us", icon: <FaInfoCircle/>, route: "/about-us"},
        {id: 4, name: "Books", icon: <FaBook/>, route: "/books"},
        {id: 5, name: "Notes", icon: <FaRegFileAlt/>, route: "/notes"},
        {id: 6, name: "Exams", icon: <FaFileAlt/>, route: "/exams"},
        {id: 7, name: "Downloads", icon: <FaDownload/>, route: "/downloads"},
        {id: 8, name: "My Plan", icon: <FaBriefcase/>, route: "/subscription"},
    ];

    const handleNavigation = (itemName, route) => {
        setActiveItem(itemName);
        navigate(route);
        if (window.innerWidth < 768) {
            props.toggleSidebar();
        }
    };

    return (
        <div
            className={`fixed top-0 left-0 h-screen w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${props.isSidebarVisible ? "translate-x-0" : "-translate-x-full"} 
        `}
        >
            <div className="flex min-h-20 justify-center space-x-6 items-center bg-[#333333]">
                <Link to="/" className="flex items-center space-x-6">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-10 w-10 md:h-8 md:w-8 lg:h-10 lg:w-10"
                    />
                    <div>
                        <h2 className="text-white font-bold text-xl tracking-widest">
                            GENESIS
                        </h2>
                        <p className="text-white text-xs"> Online School</p>
                    </div>
                </Link>
            </div>
            <div className="overflow-y-scroll">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleNavigation(item.name, item.route)}
                        className={`px-6 py-4 flex items-center cursor-pointer border-b border-gray-300
              ${
                            activeItem === item.name
                                ? "text-blue-500 border-blue-500"
                                : "hover:text-blue-500"
                        }`}
                    >
                        <span className="text-green-300">{item.icon}</span>
                        <p
                            className={`text-md font-md ml-2 ${
                                activeItem === item.name
                                    ? "text-blue-500"
                                    : "hover:text-blue-500"
                            }`}
                        >
                            {item.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

SideBar.propTypes = {
    isSidebarVisible: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
}

export default SideBar;