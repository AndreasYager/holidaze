import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import placeholderImg from "../images/placeholder.jpg";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allVenues, setAllVenues] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllVenues = async () => {
      setIsLoading(true);
      let page = 1;
      const limit = 100;
      let allFetchedVenues = [];
      try {
        while (true) {
          const response = await fetch(
            `https://v2.api.noroff.dev/holidaze/venues?limit=${limit}&page=${page}`
          );
          if (!response.ok) {
            throw new Error(
              `Failed to fetch venues, status: ${response.status}`
            );
          }
          const json = await response.json();
          const venues = json.data || json;
          if (venues.length === 0) {
            break; // Exit loop if no more venues are returned
          }
          allFetchedVenues = [...allFetchedVenues, ...venues];
          page += 1; // Move to the next page
        }
        setAllVenues(allFetchedVenues);
      } catch (error) {
        setError(`Error fetching all venues: ${error.message}`);
        console.error("Error fetching all venues:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllVenues();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const filteredSuggestions = allVenues.filter(
        (venue) =>
          venue.name.toLowerCase().includes(lowerCaseTerm) ||
          venue.location?.city?.toLowerCase().includes(lowerCaseTerm) ||
          venue.location?.address?.toLowerCase().includes(lowerCaseTerm) ||
          venue.location?.country?.toLowerCase().includes(lowerCaseTerm)
      );
      setSuggestions(filteredSuggestions);
      setDropdownOpen(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setDropdownOpen(false);
    }
  }, [searchTerm, allVenues]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/venue/${suggestion.id}`);
  };

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={() => setDropdownOpen(!dropdownOpen)}
      className="w-100"
    >
      <DropdownToggle
        tag="span"
        data-toggle="dropdown"
        aria-expanded={dropdownOpen}
      >
        <Input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name or location..."
          className="w-100"
        />
      </DropdownToggle>
      <DropdownMenu className="w-100">
        {error && <DropdownItem header>Error: {error}</DropdownItem>}
        {isLoading ? (
          <DropdownItem header>Loading...</DropdownItem>
        ) : (
          suggestions.map((suggestion) => (
            <DropdownItem
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="d-flex align-items-center"
            >
              <img
                src={suggestion.media?.[0]?.url || placeholderImg}
                alt={suggestion.media?.[0]?.alt || "Venue"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholderImg;
                }}
                style={{ width: "30px", height: "30px", marginRight: "10px" }}
              />
              {suggestion.name}
            </DropdownItem>
          ))
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default Search;
