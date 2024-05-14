import React, { useState } from "react";
import VenueList from "../../components/venuemanager/MyVenues";
import VenueCreate from "../../components/venuemanager/PostVenue";
const VenueManagerPage = () => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  const handleSelectVenue = (venue) => {
    console.log("Selected Venue:", venue);
  };

  return (
    <div>
      <h1>Venue Manager Dashboard</h1>
      <div>
        <VenueCreate accessToken={accessToken} />
      </div>
      <div>
        <VenueList
          onSelectVenue={handleSelectVenue}
          accessToken={accessToken}
        />
      </div>
    </div>
  );
};

export default VenueManagerPage;
