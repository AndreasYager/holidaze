import React from "react";
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top-bar"></div>
      <Container>
        <Row>
        <Col md="4">
            <h5>About Us</h5>
            <p>
              Holidaze is your one-stop destination for booking the best accomodations for your travels. We provide a seamless experience for both venue
              managers and customers.
            </p>
          </Col>
          <Col md="4">
            <h5>Quick Links</h5>
            <Nav vertical>
              <NavItem>
                <NavLink href="/">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/profile">My Profile</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/venuemanager">Venue Manager Dashboard</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/contact">Contact Us</NavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col md="3">
            <h5>Contact Information</h5>
            <p>Email: support@holidaze.com</p>
            <p>Phone: +1 234 567 890</p>
            <p>Address: 123 Holidaze Street, Event City</p>
          </Col>
        </Row>
        <Row>
          <Col md="12" className="text-center mt-3">
            <p>&copy; {new Date().getFullYear()} Holidaze. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
