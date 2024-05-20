import React, { useState } from "react";
import { createVenue } from "../../api/manageVenueApi";
import "./PostVenue.css"; 

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
  const [formErrors, setFormErrors] = useState({});

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

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.description) errors.description = "Description is required";
    if (formData.price <= 0) errors.price = "Price must be greater than zero";
    if (formData.maxGuests <= 0) errors.maxGuests = "Max Guests must be greater than zero";
    formData.media.forEach((item, index) => {
      if (!item.url) errors[`media.${index}.url`] = "Media URL is required";
      if (!item.alt) errors[`media.${index}.alt`] = "Alt text is required";
    });
    if (!formData.location.address) errors["location.address"] = "Address is required";
    if (!formData.location.city) errors["location.city"] = "City is required";
    if (!formData.location.zip) errors["location.zip"] = "Zip Code is required";
    if (!formData.location.country) errors["location.country"] = "Country is required";
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      await createVenue(formData, accessToken);
      alert("Venue created successfully!");
      setFormData(initialFormData);
      setFormErrors({});
    } catch (err) {
      setError(`Failed to create venue: ${err.message}`);
      console.error("Error creating venue:", err);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="venue-create-form">
      <h2>Create New Venue</h2>
      {error && <p className="error">{error}</p>}
      <div className="form-section">
        <h3>General Information</h3>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {formErrors.name && <p className="error">{formErrors.name}</p>}
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {formErrors.description && <p className="error">{formErrors.description}</p>}
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          {formErrors.price && <p className="error">{formErrors.price}</p>}
        </label>
        <label>
          Maximum Guests:
          <input
            type="number"
            name="maxGuests"
            value={formData.maxGuests}
            onChange={handleChange}
          />
          {formErrors.maxGuests && <p className="error">{formErrors.maxGuests}</p>}
        </label>
      </div>
      <div className="form-section">
        <h3>Media</h3>
        {formData.media.map((item, index) => (
          <div key={index} className="media-fields">
            <label>
              Media URL:
              <input
                type="text"
                name={`media.${index}.url`}
                value={item.url}
                onChange={handleChange}
              />
              {formErrors[`media.${index}.url`] && (
                <p className="error">{formErrors[`media.${index}.url`]}</p>
              )}
            </label>
            <label>
              Media Alt:
              <input
                type="text"
                name={`media.${index}.alt`}
                value={item.alt}
                onChange={handleChange}
              />
              {formErrors[`media.${index}.alt`] && (
                <p className="error">{formErrors[`media.${index}.alt`]}</p>
              )}
            </label>
          </div>
        ))}
      
      </div>
      <div className="form-section">
        <h3>Meta Information</h3>
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
      </div>
      <div className="form-section">
        <h3>Location Information</h3>
        <label>
          Address:
          <input
            type="text"
            name="location.address"
            value={formData.location.address}
            onChange={handleChange}
          />
          {formErrors["location.address"] && (
            <p className="error">{formErrors["location.address"]}</p>
          )}
        </label>
        <label>
          City:
          <input
            type="text"
            name="location.city"
            value={formData.location.city}
            onChange={handleChange}
          />
          {formErrors["location.city"] && (
            <p className="error">{formErrors["location.city"]}</p>
          )}
        </label>
        <label>
          Zip Code:
          <input
            type="text"
            name="location.zip"
            value={formData.location.zip}
            onChange={handleChange}
          />
          {formErrors["location.zip"] && (
            <p className="error">{formErrors["location.zip"]}</p>
          )}
        </label>
        <label>
          Country:
          <input
            type="text"
            name="location.country"
            value={formData.location.country}
            onChange={handleChange}
          />
          {formErrors["location.country"] && (
            <p className="error">{formErrors["location.country"]}</p>
          )}
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default VenueCreate;
