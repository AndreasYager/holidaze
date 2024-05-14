import React, { useState, useEffect } from "react";
import {
  Collapse,
  Navbar,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
  Button,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../../images/holidazelogo.png";
import userIcon from "../../images/holidazeprofile.png";
import hamburgerIcon from "../../images/hamburgericon.png";
import Search from "../../Search";
import AuthModal from "../AuthModal";
import { logoutUser } from "../../api/authApi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const getAuthStatus = () => {
    const token = localStorage.getItem("accessToken");
    const venueManager = localStorage.getItem("isVenueManager") === "true";
    return { token, venueManager };
  };

  useEffect(() => {
    const { token, venueManager } = getAuthStatus();
    setIsLoggedIn(!!token);
    setIsVenueManager(venueManager);

    const handleStorageChange = () => {
      const { token, venueManager } = getAuthStatus();
      setIsLoggedIn(!!token);
      setIsVenueManager(venueManager);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleProfileAccess = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      toggleModal();
    }
  };

  const handleVenueManagerAccess = () => {
    const { token, venueManager } = getAuthStatus();
    setIsLoggedIn(!!token);
    setIsVenueManager(venueManager);

    if (isLoggedIn && isVenueManager) {
      navigate("/venuemanager");
    } else if (isLoggedIn && !isVenueManager) {
      alert(
        "You are not currently set as a venue manager. Please visit your profile page to update your status."
      );
      navigate("/profile");
    } else {
      toggleModal();
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleLogout = async () => {
    const { success, message } = await logoutUser();
    if (success) {
      setIsLoggedIn(false);
      setIsVenueManager(false);
    } else {
      console.error("Logout failed:", message);
    }
  };

  const updateLoginStatus = (status) => {
    setIsLoggedIn(status);
    if (status) {
      toggleModal();
    }
  };

  return (
    <div>
      <Navbar className="header-navbar">
        <div className="menu-logo-container">
          <NavbarToggler onClick={toggleMenu} className="me-2">
            <img src={hamburgerIcon} alt="Menu" />
          </NavbarToggler>
          <a href="/" className="navbar-brand">
            <img src={logo} alt="Holidaze Logo" />
          </a>
        </div>
        <NavbarToggler onClick={handleProfileAccess} className="me-2">
          <img src={userIcon} alt="User Icon" style={{ border: "none" }} />
        </NavbarToggler>
      </Navbar>
      <div className="search-bar-container">
        <Search />
      </div>
      <Collapse isOpen={isMenuOpen} navbar>
        <Nav className="me-auto" navbar>
          <NavItem>
            <NavLink href="/">Home</NavLink>
          </NavItem>
          <NavItem onClick={handleProfileAccess}>
            <NavLink style={{ cursor: "pointer" }}>My Profile</NavLink>
          </NavItem>
          <NavItem onClick={handleVenueManagerAccess}>
            <NavLink style={{ cursor: "pointer" }}>
              Venue Manager Dashboard
            </NavLink>
          </NavItem>
          <NavItem>
            {isLoggedIn ? (
              <Button color="link" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button color="link" onClick={toggleModal}>
                Login
              </Button>
            )}
          </NavItem>
        </Nav>
      </Collapse>
      <AuthModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        updateLoginStatus={updateLoginStatus}
      />
    </div>
  );
};

export default Header;
