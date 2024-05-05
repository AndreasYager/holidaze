import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const ConfirmationModal = ({
  isOpen,
  details,
  onClose,
  onConfirm,
  bookingSuccess,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onClose}>
      <ModalHeader toggle={onClose}>
        {bookingSuccess
          ? "Success! We hope you enjoy your stay"
          : "Confirm Booking"}
      </ModalHeader>
      <ModalBody>
        {bookingSuccess ? (
          <p>Your booking was successful!</p>
        ) : (
          <>
            <p>Date From: {details.dateFrom}</p>
            <p>Date To: {details.dateTo}</p>
            <p>Number of Guests: {details.guests}</p>
            <p>Venue: {details.venueName}</p>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        {bookingSuccess ? (
          <Button color="primary" onClick={onClose}>
            Close
          </Button>
        ) : (
          <>
            <Button color="primary" onClick={onConfirm}>
              Confirm
            </Button>
            <Button color="secondary" onClick={onClose}>
              Cancel
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
