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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleProfileAccess = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
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
            {" "}
            <NavLink style={{ cursor: "pointer" }}>My Profile</NavLink>
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
