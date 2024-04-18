import React, { useState } from "react";
import { Navbar, Collapse, Nav, NavItem, NavLink } from "reactstrap";
import "./Header.css";
import logo from "../../images/holidazelogo.png";
import userIcon from "../../images/holidazeprofile.png";
import hamburgerIcon from "../../images/hamburgericon.png";
import Search from "../../Search";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div>
      <Navbar className="header-navbar">
        <div className="menu-logo-container">
          <button
            className="navbar-toggler"
            aria-label="Toggle navigation"
            onClick={toggleMenu}
            tabIndex="0"
          >
            <img src={hamburgerIcon} alt="Menu" />
          </button>
          <a href="/" className="navbar-brand">
            <img src={logo} alt="Holidaze Logo" />
          </a>
        </div>
        <button
          className="navbar-toggler"
          aria-label="User profile"
          onClick={toggleProfile}
          tabIndex="0"
        >
          <img src={userIcon} alt="User Icon" />
        </button>
      </Navbar>
      <div className="search-bar-container">
        <Search />
      </div>
      <Collapse
        isOpen={isMenuOpen}
        navbar
        className={`menu-collapse ${isMenuOpen ? "open" : ""}`}
      >
        <Nav navbar>
          <NavItem>
            <NavLink href="/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/dummy">Link 1</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/#">Link 2</NavLink>
          </NavItem>
        </Nav>
      </Collapse>
      <Collapse
        isOpen={isProfileOpen}
        navbar
        className={`profile-collapse ${isProfileOpen ? "open" : ""}`}
      >
        <Nav navbar>
          <NavItem>
            <NavLink href="#">Profile Settings</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Log Out</NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </div>
  );
};

export default Header;
