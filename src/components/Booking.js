import React, { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmationModal";
import generateApiKey from "../api/authApi";

const Booking = ({ venueId, venueName, dateFrom, dateTo }) => {
  const [guests, setGuests] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({});
  const [apiKey, setApiKey] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("Please log in to make a booking.");
      return;
    }

    const newApiKey = await generateApiKey(accessToken);
    if (!newApiKey) {
      alert("Failed to generate API key. Please try again.");
      return;
    }
    setApiKey(newApiKey);

    setBookingDetails(adjustedDetails);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await createBooking(bookingDetails, apiKey);
      setBookingSuccess(true);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Error creating booking: " + error.message);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (!modalOpen && bookingSuccess) {
      window.location.reload();
    }
  }, [modalOpen, bookingSuccess]);

  const adjustDateForTimezone = (date) => {
    const userDate = new Date(date);
    const timeOffsetInMS = userDate.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(userDate.getTime() - timeOffsetInMS);
    return adjustedDate.toISOString().split("T")[0];
  };

  const adjustedDetails = {
    dateFrom: adjustDateForTimezone(dateFrom),
    dateTo: adjustDateForTimezone(dateTo),
    guests,
    venueId,
    venueName,
  };

  const createBooking = async (bookingData, apiKey) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/holidaze/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const result = await response.json();

      console.log("Booking created:", result);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Error creating booking: " + error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Number of Guests:
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            min="1"
          />
        </label>
        <button type="submit" class="btn btn-primary">
          Book Now
        </button>
      </form>
      <ConfirmationModal
        isOpen={modalOpen}
        details={bookingDetails}
        onClose={handleClose}
        toggle={handleCancel}
        onConfirm={handleConfirm}
        bookingSuccess={bookingSuccess}
      />
    </div>
  );
};

export default Booking;
