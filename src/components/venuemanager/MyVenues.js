import React, { useState, useEffect } from "react";
import {
  fetchMyVenues,
  deleteVenue,
  updateVenue,
} from "../../api/manageVenueApi";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import placeholderImg from "../../images/placeholder.jpg";
import "./MyVenues.css";

function VenueList({ accessToken }) {
  const [venues, setVenues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVenue, setCurrentVenue] = useState(null);
  const initialFormData = {
    name: "",
    description: "",
    price: 0,
    maxGuests: 0,
    media: [{ url: "", alt: "" }],
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
      lat: 0,
      lng: 0,
    },
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    async function getVenues() {
      try {
        const venuesData = await fetchMyVenues(accessToken);
        setVenues(venuesData.data);
      } catch (error) {
        console.error("Failed to load venues:", error);
      }
    }
    getVenues();
  }, [accessToken]);

  useEffect(() => {
    if (currentVenue) {
      setFormData(currentVenue);
    }
  }, [currentVenue]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      try {
        await deleteVenue(id, accessToken);
        setVenues((prevVenues) =>
          prevVenues.filter((venue) => venue.id !== id)
        );
      } catch (error) {
        console.error("Error deleting venue:", error);
      }
    }
  };

  const handleEdit = (venue) => {
    setCurrentVenue(venue);
    setIsModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => {
        const updatedFormData = { ...prev };
        let temp = updatedFormData;

        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            temp[key] = newValue;
          } else {
            temp = temp[key];
          }
        });

        return updatedFormData;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateVenue(currentVenue.id, formData, accessToken);
      alert("Venue updated successfully!");
      setIsModalOpen(false);
      setFormData(initialFormData);
    } catch (error) {
      alert(`Failed to update venue: ${error.message}`);
      console.error("Error updating venue:", error);
    }
  };

  return (
    <div>
      <h2 className="m-4 mb-0">My Venues</h2>
      {venues.length ? (
        <ul className="venue-list">
          {venues.map((venue) => (
            <li key={venue.id} className="venue-item">
              <div className="venue-image-container">
                <img
                  src={venue.media?.[0]?.url || placeholderImg}
                  alt={venue.media?.[0]?.alt || "Venue Image"}
                  className="my-venue-image"
                />
              </div>
              <div className="venue-info">
                <div className="venue-info-content">
                  <div>
                    <h3>{venue.name}</h3>
                    <p>{venue.description}</p>
                    <p>Price: ${venue.price.toFixed(2)}</p>
                    <p>Max Guests: {venue.maxGuests}</p>
                    <p>Rating: {venue.rating}</p>
                  </div>
                  <div>
                    <Button
                      color="secondary"
                      onClick={() => handleEdit(venue)}
                      style={{ marginLeft: "10px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => handleDelete(venue.id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No venues found.</p>
      )}
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
        <ModalHeader toggle={() => setIsModalOpen(false)}>
          Edit Venue
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <label>
              Description:
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </label>
            <label>
              Maximum Guests:
              <input
                type="number"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleChange}
              />
            </label>
            {formData.media.map((item, index) => (
              <div key={index}>
                <label>
                  Media URL:
                  <input
                    type="text"
                    name={`media.${index}.url`}
                    value={item.url}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Alt Text:
                  <input
                    type="text"
                    name={`media.${index}.alt`}
                    value={item.alt}
                    onChange={handleChange}
                  />
                </label>
              </div>
            ))}
            <label>
              WiFi:
              <input
                type="checkbox"
                name="meta.wifi"
                checked={formData.meta.wifi}
                onChange={handleChange}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
              />
            </label>
            <label>
              Zip Code:
              <input
                type="text"
                name="location.zip"
                value={formData.location.zip}
                onChange={handleChange}
              />
            </label>
            <label>
              Country:
              <input
                type="text"
                name="location.country"
                value={formData.location.country}
                onChange={handleChange}
              />
            </label>
            <Button color="primary" type="submit">
              Save Changes
            </Button>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default VenueList;
