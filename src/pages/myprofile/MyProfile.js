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

const Profile = () => {
  const [avatar, setAvatar] = useState(localStorage.getItem("userAvatarUrl"));
  const [banner, setBanner] = useState(localStorage.getItem("userBannerUrl"));
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [newBannerUrl, setNewBannerUrl] = useState("");
  const [bookings, setBookings] = useState([]);
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

  return (
    <Container fluid>
      <Row
        className="bg-dark text-white p-4"
        style={{
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
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
          <ListGroup className="mt-4">
            {bookings.map((booking) => (
              <ListGroupItem key={booking.id}>
                <img
                  className="me-3"
                  src={
                    booking.venue && booking.venue.media
                      ? booking.venue.media[0].url
                      : "/path/to/default-venue-image.jpg"
                  }
                  alt="Venue"
                  style={{ width: "100%", maxWidth: "150px", height: "auto" }}
                />
                Booking ID: {booking.id}, Date:{" "}
                {new Date(booking.dateFrom).toLocaleDateString()} to{" "}
                {new Date(booking.dateTo).toLocaleDateString()}, Guests:{" "}
                {booking.guests}, Venue:{" "}
                {booking.venue ? (
                  <Link to={`/venue/${booking.venue.id}`}>
                    {booking.venue.name}
                  </Link>
                ) : (
                  "No Venue Details"
                )}
                <Button
                  color="danger"
                  size="sm"
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this booking?"
                      )
                    ) {
                      try {
                        await deleteBooking(booking.id, accessToken);
                        setBookings((prev) =>
                          prev.filter((b) => b.id !== booking.id)
                        );
                        setError("");
                        window.location.reload();
                      } catch (error) {
                        setError("Failed to delete booking: " + error.message);
                      }
                    }
                  }}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </Button>
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
