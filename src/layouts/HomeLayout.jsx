import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";
import AuthHeader from "../components/AuthHeader";
import { useState, useEffect } from "react";
import useScrollToTop from "../hooks/UseScrollToTop";

const HomeLayout = () => {
  useScrollToTop();

  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth >= 768);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarVisible(true);
      } else {
        setIsSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="flex">
        <SideBar isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
        <div
          className={`flex flex-col w-full min-h-screen ${
            isSidebarVisible ? "md:ml-72" : "md:ml-0"
          }`}
        >
          <AuthHeader toggleSidebar={toggleSidebar} />
          <Outlet />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HomeLayout;