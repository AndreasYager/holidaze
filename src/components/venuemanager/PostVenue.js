import React, { useState } from "react";
import { createVenue } from "../../api/manageVenueApi";

const VenueCreate = ({ accessToken }) => {
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
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name.includes(".")) {
      const [section, indexOrKey, key] = name.split(".");
      setFormData((prev) => {
        if (section === "media") {
          return {
            ...prev,
            media: prev.media.map((item, idx) =>
              idx === parseInt(indexOrKey) ? { ...item, [key]: newValue } : item
            ),
          };
        }
        return {
          ...prev,
          [section]: { ...prev[section], [indexOrKey]: newValue },
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseFloat(value) || 0 : newValue,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createVenue(formData, accessToken);
      alert("Venue created successfully!");
      setFormData(initialFormData);
    } catch (err) {
      setError(`Failed to create venue: ${err.message}`);
      console.error("Error creating venue:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Venue</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Name and Description */}
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>
      {/* Pricing and Guests */}
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
      {/* Media */}
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
            Media Alt:
            <input
              type="text"
              name={`media.${index}.alt`}
              value={item.alt}
              onChange={handleChange}
            />
          </label>
        </div>
      ))}
      {/* Meta Information */}
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
        Parking:
        <input
          type="checkbox"
          name="meta.parking"
          checked={formData.meta.parking}
          onChange={handleChange}
        />
      </label>
      <label>
        Breakfast:
        <input
          type="checkbox"
          name="meta.breakfast"
          checked={formData.meta.breakfast}
          onChange={handleChange}
        />
      </label>
      <label>
        Pets Allowed:
        <input
          type="checkbox"
          name="meta.pets"
          checked={formData.meta.pets}
          onChange={handleChange}
        />
      </label>
      {/* Location Information */}
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

      <button type="submit">Submit</button>
    </form>
  );
};

export default VenueCreate;
