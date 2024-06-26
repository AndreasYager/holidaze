import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { Link } from "react-router-dom";
import { fetchUserBookings, deleteBooking } from "../../api/userBookingsApi";
import {
  handleAvatarUpdate,
  handleBannerUpdate,
  handleVenueManagerStatusUpdate,
} from "../../api/userProfileApi";
import "./MyProfile.css";
import placeholderImg from "../../images/placeholder.jpg";

const Profile = () => {
  const [avatar, setAvatar] = useState(localStorage.getItem("userAvatarUrl"));
  const [banner, setBanner] = useState(localStorage.getItem("userBannerUrl"));
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [newBannerUrl, setNewBannerUrl] = useState("");
  const [bookings, setBookings] = useState([]);
  const [bookingImages, setBookingImages] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isVenueManager, setIsVenueManager] = useState(
    localStorage.getItem("isVenueManager") === "true"
  );
  const username = localStorage.getItem("userName");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (username && accessToken) {
      fetchUserBookings(username, accessToken, setBookings, setError);
    }
  }, [username, accessToken]);

  useEffect(() => {
    const initialBookingImages = bookings.reduce((acc, booking) => {
      acc[booking.id] =
        booking.venue && booking.venue.media
          ? booking.venue.media[0].url
          : placeholderImg;
      return acc;
    }, {});
    setBookingImages(initialBookingImages);
  }, [bookings]);

  const toggleModal = () => {
    setError("");
    setModalOpen(!modalOpen);
  };

  const handleProfileUpdate = async () => {
    try {
      if (newAvatarUrl) {
        await handleAvatarUpdate(
          username,
          newAvatarUrl,
          accessToken,
          setAvatar,
          setError
        );
      }
      if (newBannerUrl) {
        await handleBannerUpdate(
          username,
          newBannerUrl,
          accessToken,
          setBanner,
          setError
        );
      }
      if (isVenueManager !== localStorage.getItem("isVenueManager")) {
        await handleVenueManagerStatusUpdate(
          username,
          isVenueManager,
          accessToken,
          setIsVenueManager,
          setError
        );
      }
      setModalOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(bookingId, accessToken);
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        setError("");
      } catch (error) {
        setError("Failed to delete booking: " + error.message);
      }
    }
  };

  const handleImgError = (bookingId) => {
    setBookingImages((prev) => ({
      ...prev,
      [bookingId]: placeholderImg,
    }));
  };

  return (
    <Container fluid>
      <Row
        className="bg-dark text-white p-4"
        style={{
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          width: "90%",
          margin: "0 auto",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
        }}
      >
        <Col md="12" className="text-center">
          <img
            src={avatar}
            alt="Profile Avatar"
            className="rounded-circle img-thumbnail mb-2"
            style={{ width: "200px", height: "200px" }}
          />
          <h2>{username}</h2>
          <Button color="info" onClick={toggleModal}>
            Update Profile
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <h3 className="mt-4">My Bookings</h3>
          <ListGroup className="mt-4 bookings-list">
            {bookings.map((booking) => (
              <ListGroupItem key={booking.id} className="booking-item">
                <div className="booking-content">
                  <div className="booking-image-container">
                    <img
                      className="booking-image"
                      src={bookingImages[booking.id]}
                      alt="Venue"
                      onError={() => handleImgError(booking.id)}
                    />
                  </div>
                  <div className="booking-info">
                    <div>Booking ID: {booking.id}</div>
                    <div>
                      Date: {new Date(booking.dateFrom).toLocaleDateString()} to{" "}
                      {new Date(booking.dateTo).toLocaleDateString()}
                      <div>Guests: {booking.guests}</div>
                      <div>
                        Venue:{" "}
                        {booking.venue ? (
                          <Link to={`/venue/${booking.venue.id}`}>
                            {booking.venue.name}
                          </Link>
                        ) : (
                          "No Venue Details"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="booking-actions">
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDeleteBooking(booking.id)}
                    className="delete-button"
                  >
                    Delete
                  </Button>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Update Profile</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="newAvatarUrl">New Avatar URL</Label>
            <Input
              type="text"
              id="newAvatarUrl"
              value={newAvatarUrl}
              onChange={(e) => setNewAvatarUrl(e.target.value)}
              placeholder="Enter new avatar URL"
            />
          </FormGroup>
          <FormGroup>
            <Label for="newBannerUrl">New Banner URL</Label>
            <Input
              type="text"
              id="newBannerUrl"
              value={newBannerUrl}
              onChange={(e) => setNewBannerUrl(e.target.value)}
              placeholder="Enter new banner URL"
            />
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                id="venueManagerCheckbox"
                checked={isVenueManager}
                onChange={(e) => setIsVenueManager(e.target.checked)}
              />{" "}
              Venue Manager
            </Label>
          </FormGroup>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleProfileUpdate}>Save Changes</Button>
          <Button onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Profile;
