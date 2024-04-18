import React, { useState } from "react";
import { Card, CardImg, CardBody, CardTitle, CardText } from "reactstrap";
import placeholderImg from "../../images/placeholder.jpg";

const Venue = ({ venue }) => {
  const initialImgSrc =
    venue && venue.media && venue.media[0]
      ? venue.media[0].url
      : placeholderImg;
  const [imgSrc, setImgSrc] = useState(initialImgSrc);

  const handleImgError = () => {
    setImgSrc(placeholderImg);
  };

  if (!venue) return <div>Loading...</div>;

  return (
    <Card>
      <CardImg top src={imgSrc} alt={venue.name} onError={handleImgError} />
      <CardBody>
        <CardTitle tag="h5">{venue.name}</CardTitle>
        <CardText>{venue.description}</CardText>
        <CardText>Price: ${venue.price.toFixed(2)}</CardText>
        <CardText>Max Guests: {venue.maxGuests}</CardText>
        <CardText>Rating: {venue.rating}</CardText>
      </CardBody>
    </Card>
  );
};

export default Venue;
