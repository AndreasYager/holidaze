import React, { useState, useEffect } from "react";
import Venue from "../components/venue/Venue";
import { Container, Row, Col } from "reactstrap";
import { fetchVenues } from "../api/venueApi"; 

const HomePage = () => {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const initFetch = async () => {
      const venuesData = await fetchVenues();
      setVenues(venuesData);
    };
    initFetch();
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
