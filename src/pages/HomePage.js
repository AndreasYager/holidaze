import React, { useState, useEffect } from "react";
import Venue from "../components/venue/Venue";
import { Container, Row, Col } from "reactstrap";

const HomePage = () => {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(
          "https://v2.api.noroff.dev/holidaze/venues"
        ); // Adjust this URL to your API
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const json = await response.json();
        setVenues(json.data);
      } catch (error) {
        console.error("Failed to fetch venues:", error);
      }
    };

    fetchVenues();
  }, []);

  return (
    <Container>
      <h1>Our Venues</h1>
      <Row>
        {Array.isArray(venues) && venues.length > 0 ? (
          venues.map((venue) => (
            <Col sm="6" md="4" lg="3" key={venue.id}>
              <Venue venue={venue} />
            </Col>
          ))
        ) : (
          <Col>
            <p>No venues available.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default HomePage;
