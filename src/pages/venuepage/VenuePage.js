import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardImg, CardBody, CardTitle, CardText } from "reactstrap";
import placeholderImg from "../../images/placeholder.jpg";

const VenuePage = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setVenue(data.data);
      } catch (error) {
        console.error("Failed to fetch venue:", error);
      }
    };
    fetchVenue();
  }, [id]);

  if (!venue) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <CardImg
        top
        src={venue.media?.[0]?.url || placeholderImg}
        alt={venue.media?.[0]?.alt || "Venue Image"}
      />
      <CardBody>
        <CardTitle tag="h5">{venue.name}</CardTitle>
        <CardText>{venue.description}</CardText>
        <CardText>Price: ${venue.price.toFixed(2)}</CardText>
        <CardText>Max Guests: {venue.maxGuests}</CardText>
        <CardText>Rating: {venue.rating}</CardText>
        <CardText>
          Address: {venue.location.address}, {venue.location.city},{" "}
          {venue.location.country}
        </CardText>
        <CardText>
          Facilities:{" "}
          {`Wifi: ${venue.meta.wifi ? "Yes" : "No"}, Parking: ${
            venue.meta.parking ? "Yes" : "No"
          }, Breakfast: ${venue.meta.breakfast ? "Yes" : "No"}, Pets Allowed: ${
            venue.meta.pets ? "Yes" : "No"
          }`}
        </CardText>
      </CardBody>
    </Card>
  );
};

export default VenuePage;
