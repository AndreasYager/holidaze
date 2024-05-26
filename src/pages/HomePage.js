import React, { useState, useEffect } from "react";
import Venue from "../components/venue/Venue";
import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { fetchVenues } from "../api/venueApi";

const HomePage = () => {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 12;
  const sort = "name";

  useEffect(() => {
    const initFetch = async () => {
      setIsLoading(true);
      try {
        const venuesData = await fetchVenues(page, limit, sort, sortOrder);
        console.log("Fetched venues data:", venuesData);
        if (Array.isArray(venuesData)) {
          setVenues((prevVenues) =>
            page === 1 ? venuesData : [...prevVenues, ...venuesData]
          );
          if (venuesData.length < limit) {
            setHasMore(false);
          }
        } else {
          console.error("Expected array but got:", venuesData);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to load venues:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initFetch();
  }, [page, sortOrder]);

  const loadMore = () => {
    if (!isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    setVenues([]);
    setPage(1);
    setHasMore(true);
  };

  return (
    <Container>
      <h1 className="mb-3 mt-2">Our Venues</h1>
      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="mb-3">
        <DropdownToggle caret color="primary">Sort Order</DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => handleSortOrderChange("asc")}>
            A to Z
          </DropdownItem>
          <DropdownItem onClick={() => handleSortOrderChange("desc")}>
            Z to A
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Row>
        {Array.isArray(venues) && venues.length > 0 ? (
          venues.map((venue, index) => {
            return (
              <Col
                sm="12"
                md="4"
                lg="4"
                key={venue.id || index}
                className="mb-4"
              >
                <Venue venue={venue} />
              </Col>
            );
          })
        ) : (
          <Col>
            <p>No venues available.</p>
          </Col>
        )}
      </Row>
      {hasMore && (
        <div className="d-flex justify-content-end mt-3">
          <Button onClick={loadMore} color="primary" disabled={isLoading}>
            Load More
          </Button>
        </div>
      )}
    </Container>
  );
};

export default HomePage;
