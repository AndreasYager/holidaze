import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardImg, CardBody, CardTitle, CardText } from "reactstrap";
import Calendar from "react-calendar";
import placeholderImg from "../../images/placeholder.jpg";
import { fetchVenueDetails } from "../../api/venueApi";
import "react-calendar/dist/Calendar.css";
import "./VenuePage.css";

const VenuePage = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    const initFetch = async () => {
      const venueData = await fetchVenueDetails(id);
      if (venueData) {
        setVenue(venueData);
        const bookings =
          venueData.bookings?.map((booking) => ({
            start: new Date(new Date(booking.dateFrom).setHours(0, 0, 0, 0)),
            end: new Date(new Date(booking.dateTo).setHours(23, 59, 59, 999)),
          })) || [];
        setBookedDates(bookings);
      }
    };
    initFetch();
  }, [id]);

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      for (let booking of bookedDates) {
        if (date >= booking.start && date <= booking.end) {
          return "booked";
        }
      }
    }
  };

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
        <Calendar tileClassName={tileClassName} />
      </CardBody>
    </Card>
  );
};

export default VenuePage;
