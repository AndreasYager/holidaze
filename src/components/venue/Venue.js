import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardImg, CardBody, CardTitle, CardText } from "reactstrap";
import placeholderImg from "../../images/placeholder.jpg";
import "./Venue.css"; 

const Venue = ({ venue }) => {
  const navigate = useNavigate();
  const initialImgSrc =
    venue && venue.media && venue.media[0]
      ? venue.media[0].url
      : placeholderImg;
  const [imgSrc, setImgSrc] = useState(initialImgSrc);

  const handleImgError = () => {
    setImgSrc(placeholderImg);
  };

  const handleClick = () => {
    navigate(`/venue/${venue.id}`);
  };

  if (!venue) return <div>Loading...</div>;

  return (
    <Card onClick={handleClick} className="venue-card">
      <CardImg
        top
        src={imgSrc}
        alt={venue.name}
        onError={handleImgError}
        className="venue-image"
      />
      <CardBody>
        <CardTitle tag="h5">{venue.name}</CardTitle>
        <CardText className="venue-description">{venue.description}</CardText>
        <CardText>Price: ${venue.price.toFixed(2)}</CardText>
        <CardText>Max Guests: {venue.maxGuests}</CardText>
        <CardText>Rating: {venue.rating}</CardText>
      </CardBody>
    </Card>
  );
};

export default Venue;
