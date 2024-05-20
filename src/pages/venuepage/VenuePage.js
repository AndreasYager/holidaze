import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, CardImg, CardBody, CardTitle, CardText } from "reactstrap";
import Calendar from "react-calendar";
import placeholderImg from "../../images/placeholder.jpg";
import { fetchVenueDetails } from "../../api/venueApi";
import Booking from "../../components/Booking";
import "react-calendar/dist/Calendar.css";
import "./VenuePage.css";

const VenuePage = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState([new Date(), new Date()]);

  useEffect(() => {
    const initFetch = async () => {
      try {
        const venueData = await fetchVenueDetails(id);
        if (venueData) {
          setVenue(venueData);
          const bookings = venueData.bookings?.map((booking) => ({
            start: new Date(new Date(booking.dateFrom).setHours(0, 0, 0, 0)),
            end: new Date(new Date(booking.dateTo).setHours(23, 59, 59, 999)),
          })) || [];
          setBookedDates(bookings);
        }
      } catch (error) {
        console.error("Error fetching venue details:", error);
      }
    };
    initFetch();
  }, [id]);

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

      if (date < today) {
        return "past-date";
      }

      for (let booking of bookedDates) {
        if (date >= booking.start && date <= booking.end) {
          return "booked";
        }
      }
    }
    return null;
  };

  const handleDateChange = (range) => {
    setSelectedDateRange(range);
  };

  if (!venue) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Row className="mt-4">
        <Col md={{ size: 8, offset: 2 }}>
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
                Address: {venue.location.address}, {venue.location.city}, {venue.location.country}
              </CardText>
              <CardText>
                Facilities: Wifi: {venue.meta.wifi ? "Yes" : "No"}, Parking: {venue.meta.parking ? "Yes" : "No"}, Breakfast: {venue.meta.breakfast ? "Yes" : "No"}, Pets Allowed: {venue.meta.pets ? "Yes" : "No"}
              </CardText>
              <div className="d-flex justify-content-center my-3">

              <Calendar
                onChange={handleDateChange}
                value={selectedDateRange}
                selectRange={true}
                tileClassName={tileClassName}
              />
              </div>
              <Booking
                venueId={id}
                venueName={venue.name}
                dateFrom={selectedDateRange[0]}
                dateTo={selectedDateRange[1]}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VenuePage;
